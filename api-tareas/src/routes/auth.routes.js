const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readUsers, writeUsers } = require("../utils/users");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username y password son requeridos" });
    }

    const users = await readUsers();
    const exists = users.find((u) => u.username === username);
    if (exists) {
      return res.status(409).json({ error: "Usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, password: hash };
    users.push(newUser);
    await writeUsers(users);

    return res.status(201).json({ message: "Usuario registrado" });
  } catch (err) {
    return next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "username y password son requeridos" });
    }

    const users = await readUsers();
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Credenciales invalidas" });
    }

    const token = jwt.sign({ sub: user.id, username }, JWT_SECRET, { expiresIn: "1h" });
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
