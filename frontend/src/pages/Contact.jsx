import { useState } from "react";
import { PageHeader } from "../components/Shared";
import { useApp } from "../context/AppContext";
import { Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const { notify } = useApp();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    notify("Message sent — we'll get back to you soon.", "success");
  }

  return (
    <div>
      <PageHeader eyebrow="Contact" title="Get in touch" subtitle="Questions, feedback, or partnership ideas — we read everything." />

      <div className="mx-auto max-w-4xl px-5 sm:px-8 pb-20 grid md:grid-cols-5 gap-8">
        <div className="md:col-span-2 flex flex-col gap-5">
          <div className="ticket p-5 flex items-start gap-3">
            <Mail size={18} className="text-brass mt-0.5" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-paper/55 mt-1">support@visitingplaces.app</p>
            </div>
          </div>
          <div className="ticket p-5 flex items-start gap-3">
            <MapPin size={18} className="text-brass mt-0.5" />
            <div>
              <p className="text-sm font-medium">Response time</p>
              <p className="text-sm text-paper/55 mt-1">We typically reply within 1–2 business days.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="md:col-span-3 ticket p-6 flex flex-col gap-4">
          <label className="block">
            <span className="text-xs text-paper/50">Name</span>
            <input name="name" value={form.name} onChange={handleChange} required className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2.5 outline-none" />
          </label>
          <label className="block">
            <span className="text-xs text-paper/50">Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2.5 outline-none" />
          </label>
          <label className="block">
            <span className="text-xs text-paper/50">Message</span>
            <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="w-full mt-1 bg-ink-700 border border-paper/15 rounded-lg px-3 py-2.5 outline-none resize-none" />
          </label>
          <button className="self-start flex items-center gap-2 bg-brass text-ink-800 font-medium px-5 py-2.5 rounded-full hover:bg-brass-light transition-colors">
            <Send size={15} /> {sent ? "Sent" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
