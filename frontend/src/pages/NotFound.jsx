import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
      <Compass size={36} className="text-brass/60 mb-5" />
      <p className="font-mono text-xs uppercase tracking-widest text-brass mb-3">404</p>
      <h1 className="font-display text-3xl mb-3">Looks like you've wandered off the map</h1>
      <p className="text-paper/55 max-w-sm mb-8">The page you're looking for doesn't exist, or has moved.</p>
      <Link to="/" className="bg-brass text-ink-800 font-medium px-5 py-2.5 rounded-full hover:bg-brass-light transition-colors">
        Back to home
      </Link>
    </div>
  );
}
