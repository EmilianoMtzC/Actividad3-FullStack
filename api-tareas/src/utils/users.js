const fs = require("fs").promises;
const path = require("path");

const USERS_PATH = path.join(__dirname, "..", "data", "usuarios.json");

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_PATH, "utf8");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    if (err.code === "ENOENT") {
      return [];
    }
    throw err;
  }
}

async function writeUsers(users) {
  const raw = JSON.stringify(users, null, 2);
  await fs.writeFile(USERS_PATH, raw, "utf8");
}

module.exports = { readUsers, writeUsers };
