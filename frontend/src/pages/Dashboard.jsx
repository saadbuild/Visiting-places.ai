import { Link } from "react-router-dom";
import { Trash2, Heart, CalendarRange, Wallet, ArrowRight, Sparkles } from "lucide-react";
import { PageHeader, EmptyState } from "../components/Shared";
import { useAuth } from "../context/AuthContext";
import { useTrips } from "../context/TripsContext";
import { useApp } from "../context/AppContext";
import { useSubscription } from "../context/SubscriptionContext";
import { formatMoney, formatDate } from "../lib/format";

export default function Dashboard() {
  const { user } = useAuth();
  const { trips, favorites, deleteTrip } = useTrips();
  const { currency, notify } = useApp();
  const { plan, creditsRemaining, isUnlimited } = useSubscription();

  async function handleDelete(id) {
    await deleteTrip(id);
    notify("Trip removed.", "success");
  }

  return (
    <div>
      <PageHeader eyebrow="Dashboard" title={`Welcome back, ${user?.name?.split(" ")[0]}`} subtitle="Your saved trips, favorites, and travel stats in one place." />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-20">
        <div className="ticket p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-brass/30">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-brass shrink-0" />
            <div>
              <p className="text-sm font-medium">
                {plan ? `${plan.name} plan` : "Loading plan…"}
                {plan && (
                  <span className="text-paper/45 font-normal">
                    {" "}· {isUnlimited ? "unlimited AI credits" : `${creditsRemaining ?? 0} credits left`}
                  </span>
                )}
              </p>
              <p className="text-xs text-paper/50 mt-0.5">Used for the AI trip planner & AI assistant.</p>
            </div>
          </div>
          <Link to="/pricing" className="shrink-0 text-sm font-medium border border-brass/50 text-brass px-4 py-2 rounded-full hover:bg-brass/10 transition-colors text-center">
            Manage plan
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          <div className="ticket p-6">
            <CalendarRange size={20} className="text-brass mb-3" />
            <p className="text-2xl font-display">{trips.length}</p>
            <p className="text-xs text-paper/50 mt-1">Saved trips</p>
          </div>
          <div className="ticket p-6">
            <Heart size={20} className="text-brass mb-3" />
            <p className="text-2xl font-display">{favorites.length}</p>
            <p className="text-xs text-paper/50 mt-1">Favorites</p>
          </div>
          <div className="ticket p-6">
            <Wallet size={20} className="text-brass mb-3" />
            <p className="text-2xl font-display">
              {formatMoney(trips.reduce((sum, t) => sum + (t.budget || 0), 0), currency)}
            </p>
            <p className="text-xs text-paper/50 mt-1">Total planned budget</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl">Your trips</h2>
          <Link to="/trip-planner" className="text-sm text-brass flex items-center gap-1 hover:gap-2 transition-all">
            Plan a new trip <ArrowRight size={14} />
          </Link>
        </div>

        {trips.length === 0 ? (
          <EmptyState
            title="No trips saved yet"
            subtitle="Build an itinerary with the AI Trip Planner and save it here."
            action={<Link to="/trip-planner" className="bg-brass text-ink-800 text-sm font-medium px-5 py-2.5 rounded-full hover:bg-brass-light transition-colors">Plan a trip</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {trips.map((t) => (
              <div key={t.id} className="ticket p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg">{t.title}</p>
                    <p className="text-xs text-paper/50 mt-1">
                      {t.destination} · {t.itinerary?.length || 0} days · {t.travelers} traveler{t.travelers > 1 ? "s" : ""}
                    </p>
                    {t.startDate && <p className="text-xs text-paper/45 mt-1">Starts {formatDate(t.startDate)}</p>}
                  </div>
                  <button onClick={() => handleDelete(t.id)} className="text-paper/30 hover:text-coral transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                {t.budget != null && (
                  <p className="text-brass font-mono text-sm mt-4">{formatMoney(t.budget, currency)} estimated</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
