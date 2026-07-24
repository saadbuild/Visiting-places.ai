const express = require("express");
const { read, write } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// ---- Saved trips / itineraries ----
router.get("/", (req, res) => {
  const data = read();
  const trips = data.trips.filter((t) => t.userId === req.userId);
  res.json({ trips });
});

router.post("/", (req, res) => {
  const { title, destination, startDate, endDate, travelers, itinerary, budget } = req.body;
  if (!title || !destination) {
    return res.status(400).json({ error: "A trip needs a title and destination." });
  }

  const data = read();
  const trip = {
    id: `trip_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: req.userId,
    title,
    destination,
    startDate: startDate || null,
    endDate: endDate || null,
    travelers: travelers || 1,
    itinerary: itinerary || [],
    budget: budget || null,
    createdAt: new Date().toISOString(),
  };
  data.trips.push(trip);
  write(data);
  res.status(201).json({ trip });
});

router.delete("/:id", (req, res) => {
  const data = read();
  const before = data.trips.length;
  data.trips = data.trips.filter(
    (t) => !(t.id === req.params.id && t.userId === req.userId)
  );
  if (data.trips.length === before) {
    return res.status(404).json({ error: "Trip not found." });
  }
  write(data);
  res.json({ ok: true });
});

module.exports = router;
