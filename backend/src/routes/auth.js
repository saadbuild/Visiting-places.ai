const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { read, write } = require("../db");
const mailer = require("../mailer");

const router = express.Router();

function signToken(user) {
  return jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function publicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeIdentifier(value) {
  const trimmed = value.trim().toLowerCase();
  // If it looks like a phone number (mostly digits/spaces/dashes/parens), strip formatting.
  if (/^[+()\-\s0-9]+$/.test(trimmed)) {
    return trimmed.replace(/[()\-\s]/g, "");
  }
  return trimmed;
}

function isPhone(value) {
  return /^\+?[0-9]{7,15}$/.test(value);
}

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Enter your full name."),
    body("identifier").trim().notEmpty().withMessage("Enter an email or phone number."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, identifier, password } = req.body;
    const cleanId = normalizeIdentifier(identifier);

    if (!isEmail(cleanId) && !isPhone(cleanId)) {
      return res.status(400).json({ error: "Enter a valid email or phone number." });
    }

    const data = read();
    const exists = data.users.find(
      (u) => u.email === cleanId || u.phone === cleanId
    );
    if (exists) {
      return res.status(409).json({ error: "An account already exists for that email or phone number." });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name,
      email: isEmail(cleanId) ? cleanId : null,
      phone: isPhone(cleanId) ? cleanId : null,
      passwordHash,
      role: "user",
      createdAt: new Date().toISOString(),
      preferences: { currency: "USD", language: "en", theme: "dark" },
    };

    data.users.push(user);
    write(data);

    mailer.notifySignUp(user).catch(() => {});

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  }
);

router.post(
  "/login",
  [
    body("identifier").trim().notEmpty().withMessage("Enter your email or phone number."),
    body("password").notEmpty().withMessage("Enter your password."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { identifier, password } = req.body;
    const cleanId = normalizeIdentifier(identifier);

    const data = read();
    const user = data.users.find(
      (u) => u.email === cleanId || u.phone === cleanId
    );

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: "Incorrect email/phone or password." });
    }

    mailer.notifyLogIn(user).catch(() => {});

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  }
);

router.get("/me", require("../middleware/auth").requireAuth, (req, res) => {
  const data = read();
  const user = data.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "Account not found." });
  res.json({ user: publicUser(user) });
});

router.patch("/me", require("../middleware/auth").requireAuth, (req, res) => {
  const data = read();
  const user = data.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "Account not found." });

  const { name, preferences } = req.body;
  if (name) user.name = name;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  write(data);
  res.json({ user: publicUser(user) });
});

module.exports = router;
