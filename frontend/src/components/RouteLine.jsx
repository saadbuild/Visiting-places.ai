// A vertical dashed "route line" used between itinerary stops / timeline steps.
export default function RouteLine({ height = 48 }) {
  return (
    <svg width="24" height={height} viewBox={`0 0 24 ${height}`} className="text-brass/50">
      <line
        x1="12"
        y1="0"
        x2="12"
        y2={height}
        stroke="currentColor"
        strokeWidth="2"
        className="route-line"
      />
    </svg>
  );
}
