const express = require("express");
const { read, write } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  const data = read();
  const favorites = data.favorites.filter((f) => f.userId === req.userId);
  res.json({ favorites });
});

router.post("/", (req, res) => {
  const { itemType, itemId, name, image } = req.body;
  if (!itemType || !itemId) {
    return res.status(400).json({ error: "Missing item to favorite." });
  }

  const data = read();
  const already = data.favorites.find(
    (f) => f.userId === req.userId && f.itemType === itemType && f.itemId === itemId
  );
  if (already) return res.status(200).json({ favorite: already });

  const favorite = {
    id: `fav_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    userId: req.userId,
    itemType,
    itemId,
    name: name || itemId,
    image: image || null,
    createdAt: new Date().toISOString(),
  };
  data.favorites.push(favorite);
  write(data);
  res.status(201).json({ favorite });
});

router.delete("/:id", (req, res) => {
  const data = read();
  const before = data.favorites.length;
  data.favorites = data.favorites.filter(
    (f) => !(f.id === req.params.id && f.userId === req.userId)
  );
  if (data.favorites.length === before) {
    return res.status(404).json({ error: "Favorite not found." });
  }
  write(data);
  res.json({ ok: true });
});

module.exports = router;
