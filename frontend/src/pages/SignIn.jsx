import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Compass, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function SignIn() {
  const { login } = useAuth();
  const { notify } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ identifier, password });
      notify("Welcome back.", "success");
      navigate(location.state?.from || "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16">
      <div className="ticket w-full max-w-md p-8">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <Compass size={22} className="text-brass" />
          <span className="font-display text-lg">Visiting <span className="text-brass italic">Places</span></span>
        </Link>
        <h1 className="font-display text-2xl text-center mb-1">Welcome back</h1>
        <p className="text-sm text-paper/50 text-center mb-8">Sign in to pick up your trips where you left off.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-xs text-paper/50">Email or phone number</span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or +1 555 0100"
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2.5 outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs text-paper/50">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2.5 outline-none"
              required
            />
          </label>

          {error && <p className="text-coral-light text-sm">{error}</p>}

          <button disabled={loading} className="mt-2 bg-brass text-ink-800 font-medium py-3 rounded-full hover:bg-brass-light transition-colors flex items-center justify-center gap-2">
            {loading && <Loader2 size={16} className="animate-spin" />} Sign in
          </button>
        </form>

        <p className="text-sm text-paper/50 text-center mt-6">
          New here? <Link to="/sign-up" className="text-brass hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
