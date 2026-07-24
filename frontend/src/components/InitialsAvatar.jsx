// A passport-stamp-styled initials avatar, used as a placeholder portrait.
// Swap this out for a real uploaded photo whenever one is available — e.g.
// <img src="/team/saad-ali.jpg" alt="Saad Ali" className="w-28 h-28 rounded-full object-cover" />
export default function InitialsAvatar({ initials, size = 112, className = "" }) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Portrait placeholder with initials ${initials}`}
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <defs>
          <linearGradient id="avatarGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8AD5E" />
            <stop offset="100%" stopColor="#8F5E22" />
          </linearGradient>
        </defs>
        <circle cx="60" cy="60" r="56" fill="url(#avatarGrad)" />
        <circle cx="60" cy="60" r="49" fill="none" stroke="#1A1410" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="3 5" />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="Fraunces, serif"
          fontSize="38"
          fill="#1A1410"
        >
          {initials}
        </text>
      </svg>
    </div>
  );
}
