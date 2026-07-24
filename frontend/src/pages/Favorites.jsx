import { Heart, Trash2 } from "lucide-react";
import { PageHeader, EmptyState } from "../components/Shared";
import { useTrips } from "../context/TripsContext";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

const TYPE_ROUTES = {
  destination: (id) => `/destination/${id}`,
  hotel: (id) => `/hotels/${id}`,
  restaurant: () => "/restaurants",
  attraction: () => "/attractions",
};

export default function Favorites() {
  const { favorites, toggleFavorite } = useTrips();
  const { notify } = useApp();

  async function remove(f) {
    await toggleFavorite(f.itemType, f.itemId);
    notify("Removed from favorites.", "success");
  }

  return (
    <div>
      <PageHeader eyebrow="Favorites" title="Everything you've saved" subtitle="Hotels, restaurants, attractions, and destinations you've bookmarked." />

      <div className="mx-auto max-w-6xl px-5 sm:px-8 pb-20">
        {favorites.length === 0 ? (
          <EmptyState title="No favorites yet" subtitle="Tap the heart icon on any listing to save it here." action={<Heart size={22} className="text-brass/60" />} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((f) => (
              <div key={f.id} className="ticket overflow-hidden">
                {f.image && <img src={f.image} alt={f.name} className="h-32 w-full object-cover" />}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] text-brass font-mono uppercase">{f.itemType}</p>
                    <Link to={TYPE_ROUTES[f.itemType]?.(f.itemId) || "/"} className="text-sm font-medium hover:text-brass transition-colors">
                      {f.name}
                    </Link>
                  </div>
                  <button onClick={() => remove(f)} className="text-paper/30 hover:text-coral transition-colors shrink-0">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
