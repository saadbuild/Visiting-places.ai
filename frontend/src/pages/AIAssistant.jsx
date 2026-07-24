import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/Shared";
import { respond, SUGGESTIONS } from "../lib/assistant";
import { useSubscription } from "../context/SubscriptionContext";
import { useApp } from "../context/AppContext";

export default function AIAssistant() {
  const { consumeCredit, isOutOfCredits } = useSubscription();
  const { notify } = useApp();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi, I'm your travel assistant. Ask me about visas, food, safety, budgets, or weather for any destination." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text) {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (isOutOfCredits) {
      notify("You're out of AI credits — upgrade your plan to keep chatting.", "info");
      return;
    }
    const ok = await consumeCredit();
    if (!ok) {
      notify("You're out of AI credits — upgrade your plan to keep chatting.", "info");
      return;
    }
    setMessages((m) => [...m, { role: "user", text: trimmed }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: respond(trimmed) }]);
    }, 400);
  }

  return (
    <div>
      <PageHeader
        eyebrow="AI Assistant"
        title="Ask anything about your trip"
        subtitle="Visas, safety, currency, packing, food — quick, specific answers."
      />

      <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-20">
        {isOutOfCredits && (
          <div className="ticket p-4 mb-5 flex items-center justify-between gap-3 border-coral/40">
            <p className="text-sm text-paper/60">You're out of AI credits for this plan.</p>
            <Link to="/pricing" className="shrink-0 text-xs font-medium bg-brass text-ink-800 px-4 py-2 rounded-full hover:bg-brass-light transition-colors">
              Upgrade
            </Link>
          </div>
        )}
        <div className="ticket flex flex-col h-[60vh] min-h-[420px]">
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user" ? "bg-brass text-ink-800" : "bg-ink-700 text-paper/85"
                }`}>
                  {m.role === "assistant" && (
                    <Sparkles size={13} className="inline mr-1.5 text-brass -mt-0.5" />
                  )}
                  {m.text}
                </div>
              </motion.div>
            ))}
            <div ref={endRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs border border-paper/15 text-paper/60 rounded-full px-3 py-1.5 hover:border-brass/50 hover:text-brass transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-paper/10 p-4 flex items-center gap-3"
          >
            <Compass size={18} className="text-brass/50 shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a destination…"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button className="grid place-items-center w-9 h-9 rounded-full bg-brass text-ink-800 hover:bg-brass-light transition-colors shrink-0">
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
