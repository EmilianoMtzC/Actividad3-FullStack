// IMPORTACIÓN Y CONFIGURACIÓN INICIAL =========================================

const express = require("express");
const { readTareas, writeTareas } = require("../utils/tareas.utils.js");

const router = express.Router();

// RUTA GET ====================================================================
// GET /tareas -> devuelve todas las tareas
router.get("/", async (req, res) => {
    const tareas = await readTareas();
    res.json(tareas);
});

// RUTA POST ===================================================================
// POST /tareas -> crea una nueva tarea
router.post("/", async (req, res) => {
    const { titulo, descripcion } = req.body;

    if (!titulo || !descripcion) {
        return res.status(400).json({ msg: "Faltan datos" });
    }

    const tareas = await readTareas();

    const nuevaTarea = {
        id: Date.now(),
        titulo,
        descripcion,
    };

    tareas.push(nuevaTarea);
    await writeTareas(tareas);

    res.status(201).json(nuevaTarea);
});

// RUTA PUT ====================================================================
// PUT /tareas/:id -> actualiza una tarea existente
router.put("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descripcion } = req.body;

    const tareas = await readTareas();
    const index = tareas.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    tareas[index] = {
        ...tareas[index],
        titulo: titulo ?? tareas[index].titulo,
        descripcion: descripcion ?? tareas[index].descripcion,
    };

    await writeTareas(tareas);
    res.json(tareas[index]);
});

// RUTA DELETE =================================================================
// DELETE /tareas/:id -> elimina una tarea
router.delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    const tareas = await readTareas();
    const nuevasTareas = tareas.filter(t => t.id !== id);

    if (tareas.length === nuevasTareas.length) {
        return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    await writeTareas(nuevasTareas);
    res.json({ msg: "Tarea eliminada" });
});

module.exports = router;
