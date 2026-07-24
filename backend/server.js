require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./src/routes/auth");
const tripRoutes = require("./src/routes/trips");
const favoriteRoutes = require("./src/routes/favorites");
const subscriptionRoutes = require("./src/routes/subscriptions");
const { seedAdmin } = require("./src/db");

seedAdmin();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

// Basic rate limiting — generous for normal use, blocks brute-force bursts.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again in a few minutes." },
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/api/health", (req, res) => res.json({ ok: true, service: "visiting-places-api" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/trips", apiLimiter, tripRoutes);
app.use("/api/favorites", apiLimiter, favoriteRoutes);
app.use("/api/subscriptions", apiLimiter, subscriptionRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong on our end." });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Visiting Places API running on http://localhost:${PORT}`);
});
