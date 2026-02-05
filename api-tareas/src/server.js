// IMPORTACIONES

require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE ========================
app.use(express.json());

// RUTAS ========================
app.get("/", (req, res) => {
    res.json({ message: "API Express funcionando" });
});

app.get("/boom", async (req, res, next) => {
    try {
        // Simula un fallo en async
        throw new Error("Fallo simulado en /boom");
    } catch (err) {
        next(err);
    }
});

const tareasRoutes = require("./routes/tareas.routes");
app.use("/tareas", tareasRoutes);


// MIDDLEWARES ========================
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});


app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        error: err.message || "Error interno del servidor",
    });
});

// INICIO DE SERVIDOR ========================
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

