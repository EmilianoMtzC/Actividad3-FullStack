// IMPORTACION DE MODULOS

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// INICIALIZACION DE LA DB
require("./db/init");

// RUTAS DE AUTENTICACION
const authRoutes = require("./routes/auth.routes");
const itemsRoutes = require("./routes/items.routes");

// MIDDLEWARES
app.use(express.json());

// RUTAS

app.get('/', (req, res) => {
    res.json({message: "API Node + Express + SQLite funcionando"});
});

// Rutas de autenticación (públicas)
app.use("/api/auth", authRoutes);

// Rutas de items (protegidas por el middleware auth)
app.use("/api/items", itemsRoutes);

// INICIO DEL SERVIDOR
app.listen(PORT, () =>  {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
})