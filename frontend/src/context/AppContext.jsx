import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);

const DEFAULT_PREFS = {
  currency: "USD",
  language: "en",
  theme: "dark",
  units: "metric",
};

let toastId = 0;

export function AppProvider({ children }) {
  const [prefsState, setPrefsState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vp_prefs") || "{}");
      return { ...DEFAULT_PREFS, ...saved };
    } catch {
      return DEFAULT_PREFS;
    }
  });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem("vp_prefs", JSON.stringify(prefsState));
    document.documentElement.classList.toggle("light-theme", prefsState.theme === "light");
  }, [prefsState]);

  const updatePrefs = useCallback((patch) => {
    setPrefsState((p) => ({ ...p, ...patch }));
  }, []);

  const notify = useCallback((message, tone = "info") => {
    const id = `toast_${Date.now()}_${toastId++}`;
    setToasts((list) => [...list, { id, message, tone }]);
    setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const value = useMemo(
    () => ({
      ...prefsState,
      prefs: prefsState,
      updatePrefs,
      toasts,
      notify,
    }),
    [prefsState, updatePrefs, toasts, notify]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
