// IMPORTACIION DE MODULOS

// express: Framework para crear rutas y manejar HTTP
const express = require('express');

//bcrypt.js: Libreria para hashear y comparar contrsaenias
// 'Hasheo': Convertir texto legible a una cadena irreversible
const bcrypt = require("bcryptjs");

// jsonwebtokem: Libreria para generar y verificar tokens JWT
// JWT: JSON Web Token, estandar para autenticacion stateless
const jwt = require('jsonwebtoken');

// db: Instancia la base de datos
const db = require('../db/sqlite');



// CONFIGURACION DEL ROUTER

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_super_inseguro"



// RUTA

router.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Validacion
    if (!username || !password) {
        return res.status(400).json({error: "username y password son obligatorios"});
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const sql = "INSERT INTO users (username, password_hash) VALUES (?, ?)";
    const params = [username, passwordHash];

    db.run(sql, params, function (err) {
        if (err) {
            if (err.message.includes("UNIQUE")) {
                return res.status(409).json({ error: "El usuario ya existe"});
            }
            return res.status(500).json({ error: "Error al registrar usuario"});
        }

        res.status(201).json({ message: "Usuario registrado", userId: this.lastID})
    });
});



// RUTA LOGIN

// POST /login: Autentica un usuario y retorna un token JWT
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Validación: Verificar que username y password fueron proporcionados
    if (!username || !password) {
        return res.status(400).json({ error: "username y password son obligatorios" });
    }

    // Sentencia SQL para buscar un usuario por su username
    const sql = "SELECT * FROM users WHERE username = ?";
    const params = [username];

    // db.get(): Ejecuta una consulta que retorna UNA sola fila (SELECT con WHERE único)
    // (err, user): Si no se encuentra, user será undefined
    db.get(sql, params, (err, user) => {
        if (err) {
            return res.status(500).json({ error: "Error al buscar usuario" });
        }

        // Verificar si el usuario existe
        if (!user) {
            // 401 = Unauthorized (credenciales inválidas)
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // Comparar la contraseña proporcionada con el hash almacenado
        // bcrypt.compareSync(): Compara la contraseña plana con el hash
        const passwordIsValid = bcrypt.compareSync(password, user.password_hash);

        if (!passwordIsValid) {
            return res.status(401).json({ error: "Credenciales inválidas" });
        }

        // === GENERACIÓN DEL TOKEN JWT ===
        // jwt.sign(): Crea un nuevo token JWT
        // Parámetros: payload (datos embebidos en el token), secreto, opciones
        const token = jwt.sign(
            { userId: user.id, username: user.username }, // Payload: datos del usuario
            JWT_SECRET,                                    // Secreto para firmar el token
            { expiresIn: "1h" }                           // El token expira en 1 hora
        );

        // 200 = OK (petición exitosa)
        res.json({ message: "Login correcto", token });
    });
});

// EXPORTACION
module.exports = router;