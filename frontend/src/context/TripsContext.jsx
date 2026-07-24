import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../lib/api";

const TripsContext = createContext(null);

export function TripsProvider({ children }) {
  const { token, user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!token) {
      setTrips([]);
      setFavorites([]);
      return;
    }
    setLoading(true);
    try {
      const [t, f] = await Promise.all([api.listTrips(token), api.listFavorites(token)]);
      setTrips(t.trips);
      setFavorites(f.favorites);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refresh();
  }, [refresh, user]);

  const saveTrip = useCallback(
    async (payload) => {
      const { trip } = await api.createTrip(payload, token);
      setTrips((t) => [trip, ...t]);
      return trip;
    },
    [token]
  );

  const deleteTrip = useCallback(
    async (id) => {
      await api.deleteTrip(id, token);
      setTrips((t) => t.filter((trip) => trip.id !== id));
    },
    [token]
  );

  const isFavorite = useCallback(
    (itemType, itemId) => favorites.some((f) => f.itemType === itemType && f.itemId === itemId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (itemType, itemId, name, image) => {
      const existing = favorites.find((f) => f.itemType === itemType && f.itemId === itemId);
      if (existing) {
        await api.removeFavorite(existing.id, token);
        setFavorites((f) => f.filter((fav) => fav.id !== existing.id));
        return false;
      } else {
        const { favorite } = await api.addFavorite({ itemType, itemId, name, image }, token);
        setFavorites((f) => [...f, favorite]);
        return true;
      }
    },
    [favorites, token]
  );

  return (
    <TripsContext.Provider
      value={{ trips, favorites, loading, saveTrip, deleteTrip, isFavorite, toggleFavorite, refresh }}
    >
      {children}
    </TripsContext.Provider>
  );
}

export function useTrips() {
  const ctx = useContext(TripsContext);
  if (!ctx) throw new Error("useTrips must be used within TripsProvider");
  return ctx;
}
