// IMPORTACIONES =======================================================

// dotenv: Carga las variables del .env
// process.env: Objeto con las variables del .env
require("dotenv").config;

// express: FW web para Node.
// app: Instancia de express
const express = require("express");
const app = express();

// PORT: puerto en el que se ejecuta el servidor
const PORT = process.env.PORT || 3000;



// MIDDLEWARE =======================================================
// Convierte JSON a objeto JS
app.use(express.json());

// RUTAS =======================================================
app.get("/", (req, res) => {
    res.json({ message: "API Tareas Funciona"});
});

// INICIAR SERVIDOR =======================================================

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});