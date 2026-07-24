import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import PlanGate from "./components/PlanGate";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import DestinationDetail from "./pages/DestinationDetail";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import Restaurants from "./pages/Restaurants";
import Foods from "./pages/Foods";
import Attractions from "./pages/Attractions";
import Flights from "./pages/Flights";
import Transport from "./pages/Transport";
import Weather from "./pages/Weather";
import BudgetPlanner from "./pages/BudgetPlanner";
import FuelCalculator from "./pages/FuelCalculator";
import TripPlanner from "./pages/TripPlanner";
import AIAssistant from "./pages/AIAssistant";
import MapExplorer from "./pages/MapExplorer";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Help from "./pages/Help";
import Pricing from "./pages/Pricing";
import Payment from "./pages/Payment";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/destination/:id" element={<DestinationDetail />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id" element={<HotelDetail />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/foods" element={<Foods />} />
          <Route path="/attractions" element={<Attractions />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/weather" element={<PlanGate featureName="Weather" minPlan="standard"><Weather /></PlanGate>} />
          <Route path="/budget-planner" element={<PlanGate featureName="Budget planner" minPlan="standard"><BudgetPlanner /></PlanGate>} />
          <Route path="/fuel-calculator" element={<PlanGate featureName="Fuel calculator" minPlan="standard"><FuelCalculator /></PlanGate>} />
          <Route path="/trip-planner" element={<TripPlanner />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/map" element={<MapExplorer />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/help" element={<Help />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
