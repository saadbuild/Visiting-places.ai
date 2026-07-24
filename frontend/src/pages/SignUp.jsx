import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Loader2, Mail, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";

export default function SignUp() {
  const { register } = useAuth();
  const { notify } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState("email");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register({ name, identifier, password });
      notify("Account created — welcome to Visiting Places.", "success");
      navigate("/dashboard");
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
        <h1 className="font-display text-2xl text-center mb-1">Create your account</h1>
        <p className="text-sm text-paper/50 text-center mb-8">Save trips, favorites, and pick up any device.</p>

        <div className="flex gap-2 mb-5 ticket bg-ink-700 p-1">
          <button
            type="button"
            onClick={() => setMode("email")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-md transition-colors ${mode === "email" ? "bg-brass text-ink-800" : "text-paper/60"}`}
          >
            <Mail size={14} /> Email
          </button>
          <button
            type="button"
            onClick={() => setMode("phone")}
            className={`flex-1 flex items-center justify-center gap-1.5 text-sm py-2 rounded-md transition-colors ${mode === "phone" ? "bg-brass text-ink-800" : "text-paper/60"}`}
          >
            <Phone size={14} /> Phone
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-xs text-paper/50">Full name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2.5 outline-none"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs text-paper/50">{mode === "email" ? "Email address" : "Phone number"}</span>
            <input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={mode === "email" ? "you@example.com" : "+1 555 0100"}
              type={mode === "email" ? "email" : "tel"}
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
            {loading && <Loader2 size={16} className="animate-spin" />} Create account
          </button>
        </form>

        <p className="text-sm text-paper/50 text-center mt-6">
          Already have an account? <Link to="/sign-in" className="text-brass hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
