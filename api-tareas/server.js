// IMPORTACIONES =======================================================

// dotenv: Carga las variables del .env
// process.env: Objeto con las variables del .env
require("dotenv").config();

// express: FW web para Node.
// app: Instancia de express
const express = require("express");
const app = express();

// PORT: puerto en el que se ejecuta el servidor
const PORT = process.env.PORT || 3000;

// RUTAS DE LA CARPETA ROUTES
const tareasRouter = require("./src/routes/tareas.routes");
const authRouter = require("./src/routes/auth.routes");

// MIDDLEWARE =======================================================
// Convierte JSON a objeto JS
app.use(express.json());

// RUTAS =======================================================
// Ruta de prueba
app.get("/", (req, res) => {
    res.json({ message: "API Tareas Funciona"});
});

// Rutas de tareas
app.use("/tareas", tareasRouter);

// Ruta de auth
app.use("/auth", authRouter);

// INICIAR SERVIDOR =======================================================

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});