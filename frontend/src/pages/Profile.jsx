import { useState } from "react";
import { PageHeader } from "../components/Shared";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { CURRENCIES } from "../lib/format";
import { User, Bell, Moon, Sun } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" }, { code: "fr", label: "Français" }, { code: "es", label: "Español" },
  { code: "ar", label: "العربية" }, { code: "ja", label: "日本語" }, { code: "ur", label: "اردو" },
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { currency, language, theme, units, updatePrefs, notify } = useApp();
  const [name, setName] = useState(user?.name || "");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);

  async function saveName(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name });
      notify("Profile updated.", "success");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Account" title="Profile & settings" subtitle="Manage your details and how Visiting Places looks and speaks to you." />

      <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-20 flex flex-col gap-6">
        <div className="ticket p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={16} className="text-brass" />
            <p className="font-display text-lg">Your details</p>
            {user?.role === "admin" && (
              <span className="text-[11px] font-mono uppercase tracking-widest bg-brass/15 text-brass px-2.5 py-1 rounded-full ml-1">
                Owner account
              </span>
            )}
          </div>
          <form onSubmit={saveName} className="flex flex-col gap-4">
            <label className="block">
              <span className="text-xs text-paper/50">Full name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs text-paper/50">Email or phone</span>
              <input
                value={user?.email || user?.phone || ""}
                disabled
                className="w-full mt-1 bg-ink-700/50 border border-paper/10 rounded-lg px-3 py-2 outline-none text-paper/45"
              />
            </label>
            <button disabled={saving} className="self-start bg-brass text-ink-800 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-brass-light transition-colors">
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>
        </div>

        <div className="ticket p-6">
          <p className="font-display text-lg mb-5">Preferences</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <label className="block">
              <span className="text-xs text-paper/50">Currency</span>
              <select value={currency} onChange={(e) => updatePrefs({ currency: e.target.value })} className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none">
                {Object.keys(CURRENCIES).map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-paper/50">Language</span>
              <select value={language} onChange={(e) => updatePrefs({ language: e.target.value })} className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none">
                {LANGUAGES.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-paper/50">Units</span>
              <select value={units} onChange={(e) => updatePrefs({ units: e.target.value })} className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2 outline-none">
                <option value="metric">Metric (km, °C)</option>
                <option value="imperial">Imperial (mi, °F)</option>
              </select>
            </label>
            <div className="flex items-center justify-between bg-ink-700 border border-paper/15 rounded-lg px-3 py-2">
              <span className="text-sm flex items-center gap-2">
                {theme === "dark" ? <Moon size={15} className="text-brass" /> : <Sun size={15} className="text-brass" />}
                Dark mode
              </span>
              <button
                onClick={() => updatePrefs({ theme: theme === "dark" ? "light" : "dark" })}
                className={`w-11 h-6 rounded-full transition-colors relative ${theme === "dark" ? "bg-brass" : "bg-paper/20"}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-ink transition-all ${theme === "dark" ? "left-5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="ticket p-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm"><Bell size={16} className="text-brass" /> Trip reminders & notifications</span>
            <button
              onClick={() => setNotifications((n) => !n)}
              className={`w-11 h-6 rounded-full transition-colors relative ${notifications ? "bg-brass" : "bg-paper/20"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-ink transition-all ${notifications ? "left-5" : "left-0.5"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
