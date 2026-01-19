const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Leer el token del encabezado (header)
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No hay token, permiso denegado' });
    }

    try {
        // Quitar la palabra "Bearer " si viene en el token
        const cleanToken = token.replace('Bearer ', '');
        
        // Verificar el token
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        
        // Añadir el ID del usuario a la petición para usarlo después
        req.user = decoded;
        next(); // ¡Pasa al siguiente paso!
    } catch (error) {
        res.status(401).json({ message: 'Token no válido' });
    }
};