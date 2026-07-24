import { Star, Compass } from "lucide-react";

export function PageHeader({ eyebrow, title, subtitle, children }) {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-14 pb-8">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-brass font-mono mb-3">{eyebrow}</p>
      )}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight">{title}</h1>
          {subtitle && <p className="text-paper/60 mt-3 max-w-xl leading-relaxed">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ title, subtitle, action }) {
  return (
    <div className="ticket flex flex-col items-center justify-center text-center py-16 px-6">
      <Compass size={30} className="text-brass/70 mb-4" />
      <p className="font-display text-xl">{title}</p>
      {subtitle && <p className="text-paper/55 text-sm mt-2 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Rating({ value, count, size = 14 }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-paper/80 font-feature-tnum">
      <Star size={size} className="text-brass fill-brass" />
      {value?.toFixed(1)}
      {count != null && <span className="text-paper/45">({count.toLocaleString()})</span>}
    </span>
  );
}
