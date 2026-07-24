import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { PageHeader } from "../components/Shared";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useSubscription } from "../context/SubscriptionContext";

function PlanCard({ p, current, popular, onChoose, busy }) {
  return (
    <div className={`ticket p-7 flex flex-col relative ${popular ? "border-brass/60" : ""}`}>
      {popular && (
        <span className="absolute -top-3 left-7 bg-brass text-ink-800 text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
          Most popular
        </span>
      )}
      <p className="font-display text-2xl">{p.name}</p>
      <p className="text-sm text-paper/55 mt-1">{p.tagline}</p>

      <div className="mt-6">
        <p className="font-display text-4xl">
          {p.priceRs === 0 ? "Free" : `Rs. ${p.priceRs.toLocaleString()}`}
          {p.priceRs > 0 && <span className="text-base text-paper/45 font-body"> /{p.billingNote.replace("per ", "")}</span>}
        </p>
        {p.priceRs > 0 && (
          <p className="text-sm text-paper/50 mt-1 font-mono">≈ US$ {p.priceUsd.toFixed(2)} {p.billingNote}</p>
        )}
        <p className="text-xs text-brass mt-2">{p.creditsNote}</p>
      </div>

      <div className="ticket-perforation my-6" />

      <ul className="flex flex-col gap-2.5 flex-1">
        {p.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-paper/70">
            <Check size={15} className="text-brass mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {p.upgradeHint && (
        <p className="text-xs text-paper/45 mt-4 italic">{p.upgradeHint}</p>
      )}

      <button
        onClick={() => onChoose(p)}
        disabled={busy || current}
        className={`mt-6 w-full text-center font-medium px-5 py-2.5 rounded-full transition-colors ${
          current
            ? "bg-ink-600 text-paper/50 cursor-default"
            : "bg-brass text-ink-800 hover:bg-brass-light"
        }`}
      >
        {current ? "Your current plan" : p.priceRs === 0 ? "Continue free" : `Choose ${p.name}`}
      </button>
    </div>
  );
}

export default function Pricing() {
  const { user } = useAuth();
  const { notify } = useApp();
  const { plans, plan, selectPlan } = useSubscription();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  async function handleChoose(p) {
    if (!user) {
      notify("Sign in first to choose a plan.", "info");
      navigate("/sign-up");
      return;
    }
    setBusy(true);
    try {
      const result = await selectPlan(p.id);
      if (result.requiresPayment) {
        navigate("/payment", { state: { planId: p.id } });
      } else {
        notify(`You're on the ${p.name} plan.`, "success");
        navigate("/dashboard");
      }
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Pricing"
        title="Plans that scale with how much you plan"
        subtitle="Start free with a handful of AI credits. Upgrade whenever you need more — payment is manual via JazzCash, EasyPaisa or NayaPay, verified by our team."
      />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-12">
        {user?.role === "admin" ? (
          <div className="ticket p-6 flex items-start gap-3 border-brass/50">
            <ShieldCheck size={20} className="text-brass shrink-0 mt-0.5" />
            <div>
              <p className="font-display text-lg mb-1">You already have full owner access</p>
              <p className="text-sm text-paper/60">
                As the platform owner, every feature here is free on your account — unlimited AI credits,
                no JazzCash/EasyPaisa/NayaPay payment needed. These plans are what everyone else sees.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {plans.map((p) => (
                <PlanCard
                  key={p.id}
                  p={p}
                  current={plan?.id === p.id}
                  popular={p.id === "standard"}
                  onChoose={handleChoose}
                  busy={busy}
                />
              ))}
            </div>

            <div className="ticket p-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
              <div className="flex items-start gap-3">
                <Zap size={18} className="text-brass mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Just need a bit more than Basic?</p>
                  <p className="text-sm text-paper/55 mt-1">
                    Basic+ removes the free-credit cap for Rs. 999/mo (≈ US$ 3.59/mo) without moving all the way up to Standard.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleChoose({ id: "basicPlus", name: "Basic+" })}
                disabled={busy}
                className="shrink-0 text-sm font-medium border border-brass/50 text-brass px-5 py-2.5 rounded-full hover:bg-brass/10 transition-colors"
              >
                Upgrade for Rs. 999/mo
              </button>
            </div>

            <p className="text-xs text-paper/40 mt-6 flex items-center gap-1.5">
              <Sparkles size={12} className="text-brass" />
              USD figures are an approximate conversion at ≈ Rs. 278 per US$1 and are shown for reference only — you're always charged in PKR.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
