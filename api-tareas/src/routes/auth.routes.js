const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readUsers, writeUsers } = require("../utils/users.utils");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// ========================= REGISTER =========================
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "username y password son requeridos" });
    }

    const users = await readUsers();

    const exists = users.find(u => u.username === username);
    if (exists) {
        return res.status(409).json({ msg: "Usuario ya existe" });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now(),
        username,
        password: hash,
    };

    users.push(newUser);
    await writeUsers(users);

    res.status(201).json({ msg: "Usuario registrado" });
});

// ========================= LOGIN =========================
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "username y password son requeridos" });
    }

    const users = await readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(401).json({ msg: "Credenciales inválidas" });
    }

    const token = jwt.sign(
        { sub: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
    );

    res.json({ token });
});

module.exports = router;
