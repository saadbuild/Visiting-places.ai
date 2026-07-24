export default function StampBadge({ children, className = "" }) {
  return (
    <span
      className={`stamp inline-flex items-center justify-center px-3 py-1.5 text-[11px] font-mono uppercase tracking-widest text-brass ${className}`}
    >
      {children}
    </span>
  );
}
