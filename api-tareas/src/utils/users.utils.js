

const fs = require("fs").promises;
const path = require("path");

// Archivo donde se guardan los usuarios.
const filePath = path.join(__dirname, "../data/usuarios.json");

async function readUsers() {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        return JSON.parse(data);
    } catch (err) {
        // Si el archivo no existe devuelve una arreglo vacío.
        return [];
    }
}

async function writeUsers(users) {
    await fs.writeFile(filePath, JSON.stringify(users, null, 2));
}

module.exports = { readUsers, writeUsers };