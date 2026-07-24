const express = require("express");
const { read, write } = require("../db");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { PLANS, PAYMENT_METHODS } = require("../plans");
const mailer = require("../mailer");

const router = express.Router();

function serializePlan(plan) {
  return { ...plan, credits: plan.credits === Infinity ? "unlimited" : plan.credits };
}

function publicPlans() {
  return Object.values(PLANS)
    .filter((p) => !p.hiddenFromMainGrid)
    .map(serializePlan);
}

function newId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getOrCreateSubscription(data, userId) {
  let sub = data.subscriptions.find((s) => s.userId === userId);
  if (!sub) {
    const plan = PLANS.basic;
    sub = {
      id: newId("sub"),
      userId,
      planId: plan.id,
      status: "active",
      creditsRemaining: plan.credits,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    data.subscriptions.push(sub);
  }
  return sub;
}

// The platform-owner admin account always gets the free, unlimited Owner plan,
// regardless of whatever is stored on their subscription record.
function isAdminUser(data, userId) {
  const user = data.users.find((u) => u.id === userId);
  return !!user && user.role === "admin";
}

function effectivePlanFor(data, userId, sub) {
  if (isAdminUser(data, userId)) return PLANS.owner;
  return PLANS[sub.planId] || PLANS.basic;
}

// GET /api/subscriptions/plans — public plan catalog (Basic, Standard, Pro).
router.get("/plans", (req, res) => {
  res.json({ plans: publicPlans(), paymentMethods: PAYMENT_METHODS });
});

router.use(requireAuth);

// GET /api/subscriptions/me — the signed-in user's current plan & credit balance.
router.get("/me", (req, res) => {
  const data = read();
  const sub = getOrCreateSubscription(data, req.userId);
  write(data);
  const plan = effectivePlanFor(data, req.userId, sub);
  res.json({ subscription: sub, plan: serializePlan(plan), isAdmin: isAdminUser(data, req.userId) });
});

// POST /api/subscriptions/select { planId }
// Free plan activates immediately. Paid plans move to "pending_payment" and the
// frontend routes the user to the Payment page to submit a manual transfer.
// The owner/admin account never needs to pay — it always has the Owner plan.
router.post("/select", (req, res) => {
  const data = read();

  if (isAdminUser(data, req.userId)) {
    const sub = getOrCreateSubscription(data, req.userId);
    sub.planId = PLANS.owner.id;
    sub.status = "active";
    sub.creditsRemaining = PLANS.owner.credits;
    sub.updatedAt = new Date().toISOString();
    write(data);
    return res.json({ subscription: sub, plan: serializePlan(PLANS.owner), requiresPayment: false });
  }

  const { planId } = req.body;
  const plan = PLANS[planId];
  if (!plan || plan.id === "owner") return res.status(400).json({ error: "Unknown plan." });

  const sub = getOrCreateSubscription(data, req.userId);

  if (plan.priceRs === 0) {
    sub.planId = plan.id;
    sub.status = "active";
    sub.creditsRemaining = plan.credits;
    sub.updatedAt = new Date().toISOString();
    write(data);
    return res.json({ subscription: sub, plan: serializePlan(plan), requiresPayment: false });
  }

  sub.status = "pending_payment";
  sub.pendingPlanId = plan.id;
  sub.updatedAt = new Date().toISOString();
  write(data);
  res.json({
    subscription: sub,
    plan: serializePlan(plan),
    requiresPayment: true,
    paymentMethods: PAYMENT_METHODS,
  });
});

// GET /api/subscriptions/payments — this user's payment submissions & their status.
router.get("/payments", (req, res) => {
  const data = read();
  const payments = data.payments
    .filter((p) => p.userId === req.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ payments });
});

// POST /api/subscriptions/payments — submit proof of a manual JazzCash/EasyPaisa/NayaPay transfer.
router.post("/payments", async (req, res) => {
  const data = read();

  if (isAdminUser(data, req.userId)) {
    return res.status(400).json({ error: "The owner account already has full free access — no payment needed." });
  }

  const { planId, method, senderReference, transactionId } = req.body;
  const plan = PLANS[planId];
  if (!plan || plan.priceRs === 0) {
    return res.status(400).json({ error: "Select a paid plan first." });
  }
  if (!PAYMENT_METHODS[method]) {
    return res.status(400).json({ error: "Choose a valid payment method." });
  }
  if (!senderReference || !transactionId) {
    return res.status(400).json({ error: "Enter the sender number and transaction ID." });
  }

  const user = data.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "Account not found." });

  const payment = {
    id: newId("pay"),
    userId: req.userId,
    planId: plan.id,
    method,
    senderReference,
    transactionId,
    amountRs: plan.priceRs,
    amountUsd: plan.priceUsd,
    currency: "PKR",
    status: "pending_verification",
    createdAt: new Date().toISOString(),
  };
  data.payments.push(payment);

  const sub = getOrCreateSubscription(data, req.userId);
  sub.status = "pending_verification";
  sub.pendingPlanId = plan.id;
  sub.updatedAt = new Date().toISOString();

  write(data);

  mailer.notifyPaymentSubmitted({ user, plan, payment }).catch(() => {});

  res.status(201).json({ payment });
});

// --- Admin-only actions ---
// Gated by requireAdmin: only the seeded owner account (or any account promoted to
// role "admin") can view pending payments or verify them.

// GET /api/subscriptions/payments/pending — all payments awaiting verification.
router.get("/payments/pending", requireAdmin, (req, res) => {
  const data = read();
  const pending = data.payments
    .filter((p) => p.status === "pending_verification")
    .map((p) => ({ ...p, user: data.users.find((u) => u.id === p.userId) }))
    .map(({ user, ...p }) => ({ ...p, userName: user?.name, userContact: user?.email || user?.phone }));
  res.json({ payments: pending });
});

// POST /api/subscriptions/payments/:id/verify — mark a payment verified & activate the plan.
router.post("/payments/:id/verify", requireAdmin, async (req, res) => {
  const data = read();
  const payment = data.payments.find((p) => p.id === req.params.id);
  if (!payment) return res.status(404).json({ error: "Payment not found." });
  if (payment.status === "verified") return res.json({ payment });

  const plan = PLANS[payment.planId];
  const user = data.users.find((u) => u.id === payment.userId);
  if (!user || !plan) return res.status(404).json({ error: "Related plan or account missing." });

  payment.status = "verified";
  payment.verifiedAt = new Date().toISOString();

  const sub = getOrCreateSubscription(data, payment.userId);
  sub.planId = plan.id;
  sub.status = "active";
  sub.creditsRemaining = plan.credits;
  sub.pendingPlanId = null;
  sub.updatedAt = new Date().toISOString();

  write(data);

  mailer.notifyPaymentVerified({ user, plan, payment }).catch(() => {});

  res.json({ payment, subscription: sub });
});

// POST /api/subscriptions/consume-credit { amount? } — spend AI credits (default 1).
// The AI Trip Planner spends 150 credits per generated itinerary; the AI Assistant
// spends 1 credit per message. The owner/admin account always reports unlimited
// credits and never decrements.
router.post("/consume-credit", (req, res) => {
  const data = read();

  const rawAmount = req.body?.amount;
  const amount = Number.isFinite(rawAmount) && rawAmount > 0 ? Math.floor(rawAmount) : 1;

  if (isAdminUser(data, req.userId)) {
    return res.json({ ok: true, creditsRemaining: "unlimited" });
  }

  const sub = getOrCreateSubscription(data, req.userId);
  const plan = PLANS[sub.planId] || PLANS.basic;

  if (plan.credits === Infinity) {
    return res.json({ ok: true, creditsRemaining: "unlimited" });
  }

  const remaining = sub.creditsRemaining ?? 0;
  if (remaining < amount) {
    return res.status(402).json({
      error: `You need ${amount.toLocaleString()} AI credits for this — you have ${remaining.toLocaleString()} left.`,
      creditsRemaining: remaining,
      required: amount,
    });
  }

  sub.creditsRemaining = remaining - amount;
  sub.updatedAt = new Date().toISOString();
  write(data);
  res.json({ ok: true, creditsRemaining: sub.creditsRemaining, spent: amount });
});

module.exports = router;
