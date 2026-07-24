import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Copy, Check, Clock, Mail, ShieldCheck, Smartphone, Landmark } from "lucide-react";
import { PageHeader, EmptyState } from "../components/Shared";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useSubscription } from "../context/SubscriptionContext";
import { api } from "../lib/api";

const METHOD_ICONS = { jazzcash: Smartphone, easypaisa: Smartphone, nayapay: Landmark };

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available — silently ignore */
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] text-paper/45 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-mono truncate">{value}</p>
      </div>
      <button onClick={copy} className="shrink-0 text-paper/50 hover:text-brass transition-colors" aria-label={`Copy ${label}`}>
        {copied ? <Check size={16} className="text-brass" /> : <Copy size={16} />}
      </button>
    </div>
  );
}

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { notify } = useApp();
  const { plans, paymentMethods, subscription, refresh } = useSubscription();

  const planId = location.state?.planId || subscription?.pendingPlanId;
  const plan = useMemo(() => plans.find((p) => p.id === planId), [plans, planId]);

  const [method, setMethod] = useState("jazzcash");
  const [senderReference, setSenderReference] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    if (!token) return;
    api
      .myPayments(token)
      .then(({ payments }) => setPayments(payments))
      .catch(() => {})
      .finally(() => setLoadingPayments(false));
  }, [token]);

  if (!user) {
    return (
      <div>
        <PageHeader eyebrow="Payment" title="Sign in to continue" />
        <div className="mx-auto max-w-2xl px-5 sm:px-8 pb-20">
          <EmptyState
            title="You need an account to subscribe"
            subtitle="Create a free account, then pick a plan to see payment details here."
            action={<Link to="/sign-up" className="bg-brass text-ink-800 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-brass-light transition-colors">Create account</Link>}
          />
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div>
        <PageHeader eyebrow="Payment" title="Choose a plan first" />
        <div className="mx-auto max-w-2xl px-5 sm:px-8 pb-20">
          <EmptyState
            title="No plan selected"
            subtitle="Head back to Pricing and choose Standard or Pro to see payment details here."
            action={<Link to="/pricing" className="bg-brass text-ink-800 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-brass-light transition-colors">View plans</Link>}
          />
        </div>
      </div>
    );
  }

  const latestForPlan = payments.find((p) => p.planId === plan.id);
  const alreadyPendingOrVerified = latestForPlan && (latestForPlan.status === "pending_verification" || latestForPlan.status === "verified");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!senderReference.trim() || !transactionId.trim()) {
      notify("Enter the sender number/account and the transaction ID.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const { payment } = await api.submitPayment(
        { planId: plan.id, method, senderReference: senderReference.trim(), transactionId: transactionId.trim() },
        token
      );
      setPayments((p) => [payment, ...p]);
      await refresh();
      notify("Payment submitted — we'll verify it shortly.", "success");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Payment"
        title={`Pay for the ${plan.name} plan`}
        subtitle={`Rs. ${plan.priceRs.toLocaleString()} ${plan.billingNote} — approximately US$ ${plan.priceUsd.toFixed(2)} (reference only; you pay in PKR).`}
      />

      <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-20 grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-widest text-brass font-mono mb-1">Send payment to</p>

          <div className="ticket p-5">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone size={16} className="text-brass" />
              <p className="font-medium text-sm">JazzCash</p>
            </div>
            <CopyField label="Account number" value={paymentMethods?.jazzcash?.number || "03145490566"} />
          </div>

          <div className="ticket p-5">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone size={16} className="text-brass" />
              <p className="font-medium text-sm">EasyPaisa</p>
            </div>
            <CopyField label="Account number" value={paymentMethods?.easypaisa?.number || "03145490566"} />
          </div>

          <div className="ticket p-5">
            <div className="flex items-center gap-2 mb-3">
              <Landmark size={16} className="text-brass" />
              <p className="font-medium text-sm">NayaPay</p>
            </div>
            <CopyField label="IBAN" value={paymentMethods?.nayapay?.iban || "PK33NAUA1234503145490566"} />
          </div>

          <div className="ticket p-4 flex items-start gap-2.5 border-coral/30">
            <ShieldCheck size={16} className="text-coral shrink-0 mt-0.5" />
            <p className="text-xs text-paper/55 leading-relaxed">
              Send the exact amount shown above, then fill in the form with the number you paid from and the
              transaction ID from your JazzCash/EasyPaisa/NayaPay app. Our team verifies transfers manually — an
              email confirmation goes out to Techtig the moment your payment is submitted and again once it's verified.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          {alreadyPendingOrVerified ? (
            <div className="ticket p-6">
              {latestForPlan.status === "verified" ? (
                <>
                  <div className="flex items-center gap-2 text-brass mb-2">
                    <Check size={18} /> <p className="font-display text-lg">Payment verified</p>
                  </div>
                  <p className="text-sm text-paper/60">
                    Your {plan.name} plan is active. Head to your{" "}
                    <Link to="/dashboard" className="text-brass underline">Dashboard</Link> to keep planning.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-brass mb-2">
                    <Clock size={18} /> <p className="font-display text-lg">Payment pending verification</p>
                  </div>
                  <p className="text-sm text-paper/60">
                    We've received your transaction ID (<span className="font-mono">{latestForPlan.transactionId}</span>) and
                    it's queued for manual verification. This usually takes a little while — you'll see your plan update here,
                    and an email confirmation is sent once it's approved.
                  </p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ticket p-6 flex flex-col gap-4">
              <p className="font-display text-lg mb-1">Confirm your transfer</p>

              <div>
                <span className="text-xs text-paper/50">Paid via</span>
                <div className="grid grid-cols-3 gap-2 mt-1.5">
                  {["jazzcash", "easypaisa", "nayapay"].map((m) => {
                    const Icon = METHOD_ICONS[m];
                    return (
                      <button
                        type="button"
                        key={m}
                        onClick={() => setMethod(m)}
                        className={`flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 text-xs capitalize transition-colors ${
                          method === m ? "border-brass text-brass bg-brass/10" : "border-paper/15 text-paper/60 hover:border-paper/30"
                        }`}
                      >
                        <Icon size={16} /> {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="text-xs text-paper/50">Your sender number / account</span>
                <input
                  value={senderReference}
                  onChange={(e) => setSenderReference(e.target.value)}
                  placeholder="03XXXXXXXXX or your NayaPay IBAN"
                  required
                  className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2.5 outline-none"
                />
              </label>

              <label className="block">
                <span className="text-xs text-paper/50">Transaction ID / reference number</span>
                <input
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="From your payment app's receipt"
                  required
                  className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2.5 outline-none"
                />
              </label>

              <button
                disabled={submitting}
                className="self-start flex items-center gap-2 bg-brass text-ink-800 font-medium px-5 py-2.5 rounded-full hover:bg-brass-light transition-colors disabled:opacity-60"
              >
                <Mail size={15} /> {submitting ? "Submitting…" : "I've paid — submit for verification"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
