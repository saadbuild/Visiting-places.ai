import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, token } = useAuth();
  const { notify } = useApp();
  const location = useLocation();

  const deniedForAdmin = adminOnly && !!user && user.role !== "admin";

  useEffect(() => {
    if (deniedForAdmin) notify("That page is only available to the platform owner.", "error");
  }, [deniedForAdmin, notify]);

  if (loading) return <Loader />;
  if (!token || !user) {
    return <Navigate to="/sign-in" state={{ from: location.pathname }} replace />;
  }
  if (deniedForAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
