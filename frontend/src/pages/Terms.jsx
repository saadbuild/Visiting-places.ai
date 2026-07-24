import { PageHeader } from "../components/Shared";

const SECTIONS = [
  { title: "Using this platform", body: "Visiting Places is provided as a trip-planning tool. Prices, availability, and listings in this demo are illustrative unless connected to a live booking provider — always confirm details with the actual airline, hotel, or venue before relying on them." },
  { title: "Accounts", body: "You're responsible for keeping your password confidential and for activity under your account. Use a real, working email or phone number so you can recover access if needed." },
  { title: "Subscriptions & billing", body: "Basic is free. Basic+, Standard, and Pro are billed in Pakistani Rupees via manual JazzCash, EasyPaisa, or NayaPay transfer — no automatic recurring charge is taken from your account. Plans activate once we've manually verified your transfer, and each plan renews only when you submit another payment for the next period. AI credits reset according to your plan and don't roll over between plans." },
  { title: "Acceptable use", body: "Don't use the platform to scrape data at scale, attempt to compromise other accounts, or submit false identity information." },
  { title: "No warranty", body: "Travel information — visa rules, safety conditions, pricing — changes constantly. This platform is a planning aid, not a substitute for checking official sources before you travel." },
  { title: "Changes", body: "These terms may be updated as the product evolves. Continued use after changes means you accept the updated terms." },
];

export default function Terms() {
  return (
    <div>
      <PageHeader eyebrow="Legal" title="Terms of service" subtitle="Last updated July 2026." />
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
