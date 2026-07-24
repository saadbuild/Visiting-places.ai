import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "../components/Shared";

const FAQS = [
  { q: "Is Visiting Places free to use?", a: "Browsing destinations, hotels, restaurants, and using the Budget Planner, Fuel Calculator, and Weather pages is free for everyone. The AI Trip Planner and AI Assistant use credits — every account starts with 20 free credits, and Basic+, Standard, or Pro plans add more." },
  { q: "How do subscriptions and payment work?", a: "Pick Basic, Standard, or Pro on the Pricing page. Basic is free. Paid plans are billed manually via JazzCash, EasyPaisa, or NayaPay — after transferring the amount shown, submit your transaction ID on the Payment page and our team verifies it, usually within a short while. You'll see your plan update automatically once it's verified." },
  { q: "What happens when I run out of AI credits?", a: "The AI Trip Planner and AI Assistant will prompt you to upgrade. Basic+ (Rs. 999/mo) tops up your Basic plan, or move to Standard/Pro for more credits and extra features." },
  { q: "Where do prices come from?", a: "This demo uses representative sample pricing for hotels, restaurants, and flights so you can test every feature end-to-end. Weather data is live. Connect a booking API to replace sample prices with live rates." },
  { q: "Do I need an account to use the calculators?", a: "No — the Budget Planner, Fuel Calculator, and Weather pages all work without signing in. An account is needed to save trips/favorites and to track AI credits." },
  { q: "Can I plan a trip for a group?", a: "Yes — set the number of travelers in the Trip Planner and Budget Planner, and costs scale automatically." },
  { q: "How does the live map work?", a: "It queries OpenStreetMap's public Overpass API for real nearby places — no API key or account required." },
  { q: "Can I use my phone number instead of email?", a: "Yes — sign-up supports either email or phone number plus a password." },
  { q: "Is my data private?", a: "Your account, saved trips, favorites, and payment submissions are stored against your account only. See the Privacy Policy for details." },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ticket">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between p-5 text-left">
        <span className="font-medium text-sm sm:text-base">{q}</span>
        <ChevronDown size={18} className={`text-brass shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="px-5 pb-5 text-sm text-paper/60 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function FAQ() {
  return (
    <div>
      <PageHeader eyebrow="FAQ" title="Questions people actually ask" />
      <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-20 flex flex-col gap-3">
        {FAQS.map((f) => <FAQItem key={f.q} {...f} />)}
      </div>
    </div>
  );
}
