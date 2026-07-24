import { useEffect, useState } from "react";
import { PageHeader } from "../components/Shared";
import { destinations } from "../data/destinations";
import { hotels } from "../data/hotels";
import { restaurants } from "../data/restaurants";
import { attractions } from "../data/attractions";
import { useTrips } from "../context/TripsContext";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { api } from "../lib/api";
import { Globe2, Hotel, UtensilsCrossed, Landmark, ShieldAlert, CreditCard, Check, Clock } from "lucide-react";

export default function Admin() {
  const { trips, favorites } = useTrips();
  const { token } = useAuth();
  const { notify } = useApp();
  const [pending, setPending] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [verifyingId, setVerifyingId] = useState(null);

  const stats = [
    { icon: Globe2, label: "Destinations", value: destinations.length },
    { icon: Hotel, label: "Hotels", value: hotels.length },
    { icon: UtensilsCrossed, label: "Restaurants", value: restaurants.length },
    { icon: Landmark, label: "Attractions", value: attractions.length },
  ];

  async function loadPending() {
    if (!token) return;
    setLoadingPayments(true);
    try {
      const { payments } = await api.pendingPayments(token);
      setPending(payments);
    } catch {
      /* ignore — surfaced by empty state below */
    } finally {
      setLoadingPayments(false);
    }
  }

  useEffect(() => {
    loadPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function verify(id) {
    setVerifyingId(id);
    try {
      await api.verifyPayment(id, token);
      notify("Payment verified — plan activated and the owner was emailed.", "success");
      setPending((p) => p.filter((x) => x.id !== id));
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setVerifyingId(null);
    }
  }

  return (
    <div>
      <PageHeader eyebrow="Admin" title="Content & activity overview" subtitle="A starting point for a full admin panel — wire this up to real user/content tables in production." />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-20">
        <div className="ticket p-5 mb-8 flex items-start gap-3 border-brass/40">
          <ShieldAlert size={18} className="text-brass shrink-0 mt-0.5" />
          <p className="text-sm text-paper/60">
            You're signed in as the platform owner, so this page and payment verification below are
            available to your account only — everyone else is redirected. Payment reconciliation is still
            manual (JazzCash/EasyPaisa/NayaPay don't offer a merchant API here), so double-check the funds
            landed before marking a payment verified.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {stats.map((s) => (
            <div key={s.label} className="ticket p-6">
              <s.icon size={20} className="text-brass mb-3" />
              <p className="text-2xl font-display">{s.value}</p>
              <p className="text-xs text-paper/50 mt-1">{s.label} in catalog</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={18} className="text-brass" />
          <p className="font-display text-xl">Payments awaiting verification</p>
        </div>
        <div className="ticket p-6 mb-10">
          {loadingPayments ? (
            <p className="text-sm text-paper/45">Loading…</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-paper/45 flex items-center gap-2">
              <Clock size={15} /> Nothing pending — all submitted payments have been verified.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {pending.map((p) => (
                <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-paper/10 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">
                      {p.userName} <span className="text-paper/40 font-normal">· {p.userContact}</span>
                    </p>
                    <p className="text-xs text-paper/50 mt-1">
                      {p.planId} plan · Rs. {p.amountRs} (~US$ {p.amountUsd}) via {p.method} · txn {p.transactionId}
                    </p>
                  </div>
                  <button
                    onClick={() => verify(p.id)}
                    disabled={verifyingId === p.id}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-medium bg-brass text-ink-800 px-4 py-2 rounded-full hover:bg-brass-light transition-colors disabled:opacity-60"
                  >
                    <Check size={13} /> {verifyingId === p.id ? "Verifying…" : "Mark verified"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="ticket p-6">
            <p className="font-display text-lg mb-4">Your saved trips</p>
            {trips.length === 0 ? (
              <p className="text-sm text-paper/45">No trips saved on this account yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {trips.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-sm border-b border-paper/10 pb-2">
                    <span>{t.title}</span>
                    <span className="text-paper/45 text-xs">{t.destination}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="ticket p-6">
            <p className="font-display text-lg mb-4">Your favorites</p>
            {favorites.length === 0 ? (
              <p className="text-sm text-paper/45">No favorites saved on this account yet.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {favorites.map((f) => (
                  <div key={f.id} className="flex items-center justify-between text-sm border-b border-paper/10 pb-2">
                    <span>{f.name}</span>
                    <span className="text-paper/45 text-xs">{f.itemType}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
