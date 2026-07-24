import { PageHeader } from "../components/Shared";

const SECTIONS = [
  { title: "What we collect", body: "When you create an account, we store your name, email or phone number, and a securely hashed password — never the password itself. When you save a trip or favorite, we store what you saved against your account." },
  { title: "Subscriptions & payments", body: "If you choose a paid plan, we store the plan you selected, your AI credit balance, and — only for manual transfer verification — the payment method, sender number/IBAN, and transaction ID you submit on the Payment page. We never ask for or store your JazzCash/EasyPaisa PIN, NayaPay password, or full card details; that verification happens entirely inside your own banking app." },
  { title: "How we use it", body: "Your data is used solely to run your account: signing you in, showing your saved trips and favorites, tracking your plan and AI credits, and applying your currency, language, and theme preferences." },
  { title: "Third-party requests", body: "Weather lookups and map data are sent to Open-Meteo and OpenStreetMap's Overpass API as anonymous location queries — we don't attach your account identity to those requests." },
  { title: "Data retention", body: "Your account data is kept until you ask us to delete it. Contact support to request account deletion at any time." },
  { title: "Security", body: "Passwords are hashed before storage, connections use standard web security headers, and API requests are rate-limited to reduce abuse." },
  { title: "Your choices", body: "You can update your name and preferences anytime from your Profile page, and remove individual trips or favorites whenever you like." },
];

export default function Privacy() {
  return (
    <div>
      <PageHeader eyebrow="Legal" title="Privacy policy" subtitle="Last updated July 2026 — plain-language summary of how this demo handles your data." />
      <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-20 flex flex-col gap-8">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h2 className="font-display text-xl mb-2">{s.title}</h2>
            <p className="text-paper/60 leading-relaxed text-sm">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
