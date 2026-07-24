import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useApp } from "../context/AppContext";
import Loader from "./Loader";

// Plan tiers, ranked. The owner/admin account always resolves to "owner" and
// outranks everything, so it's never blocked by a PlanGate.
const TIER_RANK = { basic: 0, basicPlus: 0, standard: 1, pro: 2, owner: 99 };

// Wrap a route with <PlanGate minPlan="standard" featureName="Weather">
// to require sign-in AND a plan at or above minPlan. Below that tier, the
// visitor is redirected to /pricing with an explanatory toast instead of
// seeing the feature.
export default function PlanGate({ children, minPlan = "standard", featureName = "This feature" }) {
  const { user, loading: authLoading, token } = useAuth();
  const { plan, loading: planLoading } = useSubscription();
  const { notify } = useApp();
  const location = useLocation();

  const loading = authLoading || planLoading;
  const currentRank = plan ? TIER_RANK[plan.id] ?? 0 : -1;
  const requiredRank = TIER_RANK[minPlan] ?? 1;
  const denied = !!token && !!user && !loading && currentRank < requiredRank;

  useEffect(() => {
    if (denied) {
      notify(`${featureName} is part of Standard and above — upgrade to unlock it.`, "info");
    }
  }, [denied, notify, featureName]);

  if (loading) return <Loader />;
  if (!token || !user) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }
  if (denied) {
    return <Navigate to="/pricing" replace />;
  }
  return children;
}
