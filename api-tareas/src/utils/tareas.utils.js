// IMPORTACION y CONFIGURACION ================================================================================

const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../data/tareas.json");

async function readTareas() {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
}

async function writeTareas(tareas) {
    await fs.writeFile(filePath, JSON.stringify(tareas, null, 2));
}

module.exports = { readTareas, writeTareas };
