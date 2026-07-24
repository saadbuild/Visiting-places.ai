const jwt = require("jsonwebtoken");
const { read } = require("../db");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Sign in required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Your session has expired. Sign in again." });
  }
}

// Must run after requireAuth (needs req.userId already set).
function requireAdmin(req, res, next) {
  const data = read();
  const user = data.users.find((u) => u.id === req.userId);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
