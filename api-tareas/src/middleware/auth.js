// IMPORTACION y CONFIGURACION INICIAL ================================================================================

const jwt = require("jsonwebtoken");                                    // CREA TOKENS JWT, VERIFICA Y DECODIFICA.
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";      // CLAVE SECRETA PARA FIRMAR Y VERIFICAR TOKENS.

function auth(req, res, next) {
    /* MIDDLEWARE:
       req: REQUEST.
       res: RESPONSE.
       next: FUNCION PARA CONTINUAR AL SIGUIENTE MIDDLEWARE.
     */
    const header = req.headers.authorization;                   // LEER LA AUTENTICACION DEL HEADER.
    const [type, token] = header.split(" ");     // SEPARAR TIPO (BAREAR) Y TOKEN ($$$$$$).

    if (type !== "Bearer" || !token) {
        // CONDICION QUE VALIDA EL TIPO DE TOKEN Y SI EL TOKEN EXISTE.
        return res.status(401).json({ error: "Token requerido" });        // SI FALLA LANZA ERROR 401 Y DETIENE LA EJECUCION.
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        /* jwt.verify:
            1. VERIFICA LA FIRMA DEL TOKEN CON LA CLAVE SECRETA.
            2. REVISA SI EL TOKEN EXPIRO.
            3. DECODIFICA EL CONTENIDO (payload).
        */
        req.user = payload;     // GUARDA EL USUARIO EN LA REQUEST.
        return next();          // CONTINUA CON LA PETICION.

    } catch (err) {
        /* CUANDO SE EJECUTA ESTE catch?
        - Si el token no es valido.
        - Si la firma no coincide.
        - El token expiro.
        - El token fue alterado.
        */
        return res.status(401).json({ error: "Token invalido" })
    }
}

// EXPORTACION DE MIDDLEWARES ================================================================================
module.exports = auth;