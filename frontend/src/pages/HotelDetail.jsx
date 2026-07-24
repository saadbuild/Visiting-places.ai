import { useParams, Navigate, Link } from "react-router-dom";
import { getHotel } from "../data/hotels";
import { getDestination } from "../data/destinations";
import { restaurantsFor } from "../data/restaurants";
import { attractionsFor } from "../data/attractions";
import { Rating } from "../components/Shared";
import FavoriteButton from "../components/FavoriteButton";
import MapView from "../components/MapView";
import { Check, MapPin, ShieldCheck } from "lucide-react";

export default function HotelDetail() {
  const { id } = useParams();
  const hotel = getHotel(id);
  if (!hotel) return <Navigate to="/hotels" replace />;
  const dest = getDestination(hotel.destinationId);
  const nearbyRestaurants = restaurantsFor(hotel.destinationId).slice(0, 2);
  const nearbyAttractions = attractionsFor(hotel.destinationId).slice(0, 2);

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
      <div className="grid md:grid-cols-2 gap-2 mb-8 rounded-stub overflow-hidden">
        <img src={hotel.image} alt={hotel.name} className="h-72 md:h-96 w-full object-cover" />
        <div className="grid grid-cols-2 gap-2">
          {hotel.gallery.map((g, i) => (
            <img key={i} src={g} alt="" className="h-36 md:h-[11.5rem] w-full object-cover" />
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-brass font-mono uppercase tracking-widest">{hotel.type}</p>
              <h1 className="font-display text-4xl mt-1">{hotel.name}</h1>
              <p className="text-paper/55 flex items-center gap-1 mt-2 text-sm">
                <MapPin size={14} /> {dest?.name}, {dest?.country} · {hotel.distanceFromCenterKm} km from center
              </p>
            </div>
            <FavoriteButton itemType="hotel" itemId={hotel.id} name={hotel.name} image={hotel.image} />
          </div>

          <div className="flex items-center gap-4 mt-4">
            <Rating value={hotel.rating} count={hotel.reviewCount} size={16} />
          </div>

          <div className="ticket p-6 mt-8">
            <p className="font-display text-lg mb-4">Amenities</p>
            <div className="grid grid-cols-2 gap-3">
              {hotel.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-paper/70">
                  <Check size={15} className="text-brass" /> {a}
                </div>
              ))}
            </div>
          </div>

          <div className="ticket p-6 mt-6 flex items-start gap-3">
            <ShieldCheck size={18} className="text-brass mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium">Cancellation policy</p>
              <p className="text-sm text-paper/55 mt-1">{hotel.cancellation}</p>
            </div>
          </div>

          {dest && (
            <div className="mt-8">
              <p className="font-display text-lg mb-4">Location</p>
              <MapView center={[dest.lat, dest.lon]} markers={[{ lat: dest.lat, lon: dest.lon, name: hotel.name }]} height={320} />
            </div>
          )}

          <div className="mt-8">
            <p className="font-display text-lg mb-4">Nearby</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {nearbyRestaurants.map((r) => (
                <div key={r.id} className="ticket p-4 flex gap-3">
                  <img src={r.image} className="w-16 h-16 rounded-md object-cover" alt="" />
                  <div>
                    <p className="text-xs text-brass font-mono">Restaurant</p>
                    <p className="text-sm font-medium">{r.name}</p>
                  </div>
                </div>
              ))}
              {nearbyAttractions.map((a) => (
                <div key={a.id} className="ticket p-4 flex gap-3">
                  <img src={a.image} className="w-16 h-16 rounded-md object-cover" alt="" />
                  <div>
                    <p className="text-xs text-brass font-mono">Attraction</p>
                    <p className="text-sm font-medium">{a.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="ticket p-6 sticky top-24">
            <p className="text-3xl font-display text-brass">${hotel.pricePerNightUSD}<span className="text-sm text-paper/50 font-body"> / night</span></p>
            <p className="text-xs text-paper/45 mt-1">Taxes and fees calculated at checkout</p>
            <button className="w-full mt-6 bg-brass text-ink-800 font-medium py-3 rounded-full hover:bg-brass-light transition-colors">
              Check availability
            </button>
            <Link to={`/budget-planner?hotel=${hotel.pricePerNightUSD}`} className="block text-center text-sm text-brass mt-4 hover:underline">
              Add to a trip budget
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
