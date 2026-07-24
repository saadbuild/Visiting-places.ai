import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertTriangle } from "lucide-react";
import { useApp } from "../context/AppContext";

const ICONS = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
};

export default function Toasts() {
  const { toasts } = useApp();
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.tone] || Info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              className="ticket flex items-start gap-2.5 px-4 py-3 bg-ink-700 shadow-ticket"
            >
              <Icon size={18} className={t.tone === "error" ? "text-coral" : "text-brass"} />
              <p className="text-sm text-paper/90 leading-snug">{t.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
