// IMPORTACION DE MODULOS

const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// CONFIG DE LA RUTA DE LA BASE DE DATOS

const dbPath = path.resolve(__dirname, "database.sqlite");

// CREACION DE LA CONEXION

const db = new sqlite3.Database(dbPath, (err) => {
    if(err) {
        console.error("Error al conectar con SQLite:", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite.");
    }
});

// EXPORTACION

module.exports = db;