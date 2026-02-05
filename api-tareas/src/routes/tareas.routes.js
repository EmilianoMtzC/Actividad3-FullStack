// IMPORTACIONES ========================
const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const router = express.Router();
const DATA_PATH = path.join(__dirname, "..", "data", "tareas.json");

// FUNCIONES NECESARIAS (Asíncronas con fs.promises) ========================
/**
 * Lee el archivo tareas.json de forma asíncrona.
 * @returns {Promise<Array>} Array de tareas o array vacío si el archivo está vacío.
 */
async function readTasks() {
    try {
        const raw = await fs.readFile(DATA_PATH, "utf8");
        return raw ? JSON.parse(raw) : [];
    } catch (error) {
        // Si el archivo no existe, retorna un array vacío
        if (error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
}

/**
 * Escribe las tareas en el archivo tareas.json de forma asíncrona.
 * @param {Array} tasks - Array de tareas a guardar.
 * @returns {Promise<void>}
 */
async function writeTasks(tasks) {
    await fs.writeFile(DATA_PATH, JSON.stringify(tasks, null, 2), "utf8");
}

// FUNCIONES PRINCIPALES (Asíncronas): ========================

// GET tareas: Lee el JSON y devuelve todas las tareas.
router.get("/", async (req, res) => {
    try {
        const tasks = await readTasks();
        res.json(tasks);
    } catch (error) {
        console.error("Error al leer tareas:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST tareas: Crea una tarea nueva (necesita titulo y descripcion).
router.post("/", async (req, res) => {
    try {
        const { titulo, descripcion } = req.body;

        if (!titulo || !descripcion) {
            return res.status(400).json({ error: "titulo y descripcion son obligatorios" });
        }

        const tasks = await readTasks();
        const nextId = tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1;

        const newTask = { id: nextId, titulo, descripcion };
        tasks.push(newTask);
        await writeTasks(tasks);

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Error al crear tarea:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT tareas: Actualiza la tarea por id.
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { titulo, descripcion } = req.body;

        if (!titulo || !descripcion) {
            return res.status(400).json({ error: "titulo y descripcion son obligatorios" });
        }

        const tasks = await readTasks();
        const index = tasks.findIndex((t) => t.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        tasks[index] = { id, titulo, descripcion };
        await writeTasks(tasks);

        res.json(tasks[index]);
    } catch (error) {
        console.error("Error al actualizar tarea:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE tareas: Elimina tarea por id
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const tasks = await readTasks();
        const index = tasks.findIndex((t) => t.id === id);

        if (index === -1) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }

        const [deleted] = tasks.splice(index, 1);
        await writeTasks(tasks);

        res.json(deleted);
    } catch (error) {
        console.error("Error al eliminar tarea:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// EXPORTACION ========================
module.exports = router;