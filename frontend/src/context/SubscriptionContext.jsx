import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../lib/api";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { token, user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Plan catalog is public — load it regardless of auth state.
  useEffect(() => {
    let cancelled = false;
    api
      .listPlans()
      .then(({ plans, paymentMethods }) => {
        if (!cancelled) {
          setPlans(plans);
          setPaymentMethods(paymentMethods);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!token) {
      setSubscription(null);
      setPlan(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { subscription, plan } = await api.mySubscription(token);
      setSubscription(subscription);
      setPlan(plan);
    } catch {
      setSubscription(null);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh, user]);

  const selectPlan = useCallback(
    async (planId) => {
      const result = await api.selectPlan(planId, token);
      setSubscription(result.subscription);
      setPlan(result.plan);
      return result;
    },
    [token]
  );

  const submitPayment = useCallback(
    async (payload) => {
      const result = await api.submitPayment(payload, token);
      await refresh();
      return result;
    },
    [token, refresh]
  );

  // Returns true if enough credits were available and spent; false if the caller
  // should show an upgrade prompt instead of proceeding with the AI feature.
  const consumeCredit = useCallback(async (amount = 1) => {
    if (!token) return true; // guests aren't credit-gated in this build
    try {
      const result = await api.consumeCredit(token, amount);
      setSubscription((s) => (s ? { ...s, creditsRemaining: result.creditsRemaining } : s));
      return true;
    } catch {
      return false;
    }
  }, [token]);

  const creditsRemaining = subscription?.creditsRemaining;
  const isUnlimited = creditsRemaining === "unlimited" || plan?.credits === "unlimited";
  const isOutOfCredits = !!token && !isUnlimited && (creditsRemaining ?? 0) <= 0;

  const value = useMemo(
    () => ({
      plans,
      paymentMethods,
      subscription,
      plan,
      loading,
      refresh,
      selectPlan,
      submitPayment,
      consumeCredit,
      creditsRemaining,
      isUnlimited,
      isOutOfCredits,
    }),
    [plans, paymentMethods, subscription, plan, loading, refresh, selectPlan, submitPayment, consumeCredit, creditsRemaining, isUnlimited, isOutOfCredits]
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
