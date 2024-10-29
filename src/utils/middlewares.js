const jwt = require('jsonwebtoken');

const User = require('../models/users.model');

exports.checkToken = async (req, res, next) => {
    // Comprobar si el token viene incluido en la cabecera Authorization
    if (!req.headers['authorization']) {
        return res.status(403).json({ message: 'Es necesario incluir el token de autorización' });
    }

    const token = req.headers['authorization'];

    // Comprobar si el token es correcto
    let data;
    try {
        data = jwt.verify(token, 'en un lugar de la mancha');
    } catch (error) {
        return res.status(403).json({ message: 'El token de autenticación es incorrecto' });
    }

    // Recupero el usuario
    const user = await User.findById(data.usuario_id).populate('cart');

    // El usuario no existe
    if (!user) {
        return res.status(403).json({ message: 'El usuario no existe' });
    }

    // Colocamos el usuario dentro de la petición
    req.user = user;

    next();
}