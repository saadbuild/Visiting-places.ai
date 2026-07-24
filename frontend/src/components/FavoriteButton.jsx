import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTrips } from "../context/TripsContext";
import { useApp } from "../context/AppContext";

export default function FavoriteButton({ itemType, itemId, name, image, className = "" }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useTrips();
  const { notify } = useApp();
  const navigate = useNavigate();
  const active = user && isFavorite(itemType, itemId);

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      notify("Sign in to save favorites.", "info");
      navigate("/sign-in");
      return;
    }
    const nowActive = await toggleFavorite(itemType, itemId, name, image);
    notify(nowActive ? "Added to favorites" : "Removed from favorites", "success");
  }

  return (
    <button
      onClick={handleClick}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      className={`grid place-items-center w-9 h-9 rounded-full bg-ink-800/80 backdrop-blur border border-paper/15 hover:border-brass/60 transition-colors ${className}`}
    >
      <Heart size={16} className={active ? "text-coral fill-coral" : "text-paper/80"} />
    </button>
  );
}
