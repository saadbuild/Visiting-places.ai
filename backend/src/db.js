// Tiny synchronous JSON-file datastore.
// Good enough for a demo/portfolio project — swap for Postgres/Mongo in production.
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const EMPTY_DB = { users: [], trips: [], favorites: [], subscriptions: [], payments: [] };

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(EMPTY_DB, null, 2));
  }
}

function read() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    data = { ...EMPTY_DB };
  }
  // Migrate older db.json files that predate the subscriptions/payments collections.
  let changed = false;
  for (const key of Object.keys(EMPTY_DB)) {
    if (!Array.isArray(data[key])) {
      data[key] = [];
      changed = true;
    }
  }
  // Migrate older user records that predate the role field.
  for (const user of data.users) {
    if (!user.role) {
      user.role = "user";
      changed = true;
    }
  }
  if (changed) write(data);
  return data;
}

function write(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Creates (or repairs) the platform-owner admin account so the owner can sign in with
// full, free access instead of going through the paid-plan flow. Configure the address
// and password via ADMIN_ACCOUNT_EMAIL / ADMIN_ACCOUNT_PASSWORD in .env — change the
// password there and restart the server to rotate it.
function seedAdmin() {
  const email = (process.env.ADMIN_ACCOUNT_EMAIL || "techtig9@gmail.com").trim().toLowerCase();
  const password = process.env.ADMIN_ACCOUNT_PASSWORD || "Techtig@Admin123";
  const name = process.env.ADMIN_ACCOUNT_NAME || "Saad Ali";

  const data = read();
  let admin = data.users.find((u) => u.email === email);

  if (!admin) {
    admin = {
      id: `usr_admin_${Date.now()}`,
      name,
      email,
      phone: null,
      passwordHash: bcrypt.hashSync(password, 10),
      role: "admin",
      createdAt: new Date().toISOString(),
      preferences: { currency: "PKR", language: "en", theme: "dark" },
    };
    data.users.push(admin);
    write(data);
    console.log(`[seed] Created owner/admin account (${email}). Log in with the password set in ADMIN_ACCOUNT_PASSWORD.`);
  } else if (admin.role !== "admin") {
    admin.role = "admin";
    write(data);
    console.log(`[seed] Promoted existing account (${email}) to admin.`);
  }
}

module.exports = { read, write, seedAdmin };
