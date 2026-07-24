export default function TicketCard({ children, className = "", notch = true, as: Comp = "div", ...rest }) {
  return (
    <Comp className={`ticket ${notch ? "ticket-notch" : ""} ${className}`} {...rest}>
      {children}
    </Comp>
  );
}

export function TicketPerforation({ className = "" }) {
  return <div className={`ticket-perforation ${className}`} />;
}
