import { Compass } from "lucide-react";

export default function Loader({ label = "Loading" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-paper/60">
      <Compass size={28} className="animate-spin" style={{ animationDuration: "2.2s" }} />
      <p className="text-sm font-mono tracking-widest uppercase">{label}…</p>
    </div>
  );
}
