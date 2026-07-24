import { PageHeader } from "../components/Shared";
import StampBadge from "../components/StampBadge";
import InitialsAvatar from "../components/InitialsAvatar";
import {
  Facebook, Instagram, Mail, Phone, Code2, Smartphone, Brain, Palette,
  Bot, Megaphone, ExternalLink,
} from "lucide-react";

const SOCIALS = [
  { icon: Facebook, label: "Facebook", handle: "techtig", href: "https://facebook.com/techtig" },
  { icon: Instagram, label: "Instagram", handle: "techtig9", href: "https://instagram.com/techtig9" },
  { icon: Mail, label: "Email", handle: "techtig9@gmail.com", href: "mailto:techtig9@gmail.com" },
  { icon: Phone, label: "Phone", handle: "+92 348597892", href: "tel:+92348597892" },
];

const SERVICES = [
  { icon: Code2, title: "Web development", text: "Marketing sites, dashboards & full-stack web apps." },
  { icon: Smartphone, title: "App development", text: "Cross-platform mobile & desktop apps." },
  { icon: Brain, title: "AI development", text: "Custom AI features built into your product." },
  { icon: Palette, title: "UI/UX design", text: "Interfaces people enjoy using, not just tolerate." },
  { icon: Bot, title: "AI chatbots", text: "Support & sales chatbots trained on your content." },
  { icon: Megaphone, title: "Digital marketing", text: "SEO, content & campaigns that bring people back." },
];

const FREELANCE = [
  { label: "Fiverr", href: "https://www.fiverr.com/techtig" },
  { label: "Upwork", href: "https://www.upwork.com/freelancers/techtig" },
  { label: "Freelancer", href: "https://www.freelancer.com/u/techtig" },
];

export default function About() {
  return (
    <div>
      <PageHeader eyebrow="About" title="A Techtig product" subtitle="Visiting Places is built and maintained by Techtig — a small studio that designs and ships digital products end to end." />

      <div className="mx-auto max-w-3xl px-5 sm:px-8 pb-16">
        <div className="flex flex-wrap gap-2 mb-6">
          <StampBadge>Since 2026</StampBadge>
          <StampBadge>Made by Techtig</StampBadge>
        </div>

        <div className="ticket p-6 sm:p-7 flex flex-col sm:flex-row items-start gap-5 mb-8">
          <InitialsAvatar initials="SA" size={80} />
          <div>
            <p className="font-display text-xl">Saad Ali</p>
            <p className="text-sm text-brass mb-3">Founder & CEO, Techtig</p>
            <p className="text-sm text-paper/60 leading-relaxed">
              Techtig is a digital studio building web, mobile, and AI-driven products —
              Visiting Places is one of ours, designed to bring an entire trip-planning
              toolkit into a single, honest place.
            </p>
          </div>
        </div>

        <p className="text-paper/70 leading-relaxed text-lg mb-5">
          Visiting Places started from a simple frustration: planning a trip means twelve browser tabs —
          one for flights, one for weather, one for currency conversion, one for "is this actually safe."
        </p>
        <p className="text-paper/60 leading-relaxed mb-5">
          We built one place that pulls it together — real weather forecasts, an honest budget calculator,
          a fuel cost estimator for road trips, and an AI itinerary builder that actually uses the destination's
          real hotels, restaurants, and attractions instead of generic placeholders.
        </p>
        <p className="text-paper/60 leading-relaxed mb-10">
          It's still evolving. If there's a feature you wish existed, the Contact page reaches a real inbox.
        </p>

        <div className="ticket-perforation mb-10" />

        <p className="text-xs uppercase tracking-widest text-brass font-mono mb-4">What Techtig builds</p>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {SERVICES.map((s) => (
            <div key={s.title} className="ticket p-5">
              <s.icon size={18} className="text-brass mb-2.5" />
              <p className="font-medium text-sm mb-1">{s.title}</p>
              <p className="text-xs text-paper/55 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>

        <p className="text-xs uppercase tracking-widest text-brass font-mono mb-4">Hire Techtig</p>
        <div className="flex flex-wrap gap-3 mb-10">
          {FREELANCE.map((f) => (
            <a
              key={f.label}
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm border border-paper/15 rounded-full px-4 py-2 hover:border-brass/50 hover:text-brass transition-colors"
            >
              {f.label} <ExternalLink size={13} />
            </a>
          ))}
        </div>
        <p className="text-xs text-paper/40 -mt-6 mb-10">All listed under the account name "techtig".</p>

        <p className="text-xs uppercase tracking-widest text-brass font-mono mb-4">Get in touch</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} className="ticket p-4 flex items-center gap-3 hover:border-brass/50 transition-colors">
              <s.icon size={17} className="text-brass shrink-0" />
              <div className="min-w-0">
                <p className="text-xs text-paper/45">{s.label}</p>
                <p className="text-sm truncate">{s.handle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
