// IMPORTACION DE MODULOS

const db = require("./sqlite");

// CREACION DE TABLAS

db.serialize(() => {
    // TABLA DE USUARIOS
    // users: Almacena los usuarios registrados en el sistema.
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único auto-incrementado
            username TEXT UNIQUE NOT NULL,         -- Nombre de usuario (único)
            password_hash TEXT NOT NULL            -- Contraseña hasheada (nunca en texto plano)
        )
    `);

    // TABLA DE ITEMS
    // items: Ejemplo de un recurso preotegido que solo usuarios autenticados pueden acceder.
    db.run(`
        CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,  -- ID único auto-incrementado
            name TEXT NOT NULL,                    -- Nombre del item
            description TEXT                       -- Descripción opcional del item
        )
    `);

    // Confirmar que las tablas se crearon correctamente.
    console.log("Tablas creadas / verificadas.");
});

// EXPORTACION
module.exports = db;