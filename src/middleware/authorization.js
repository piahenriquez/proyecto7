const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    let token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    try {
        const openToken = jwt.verify(token, process.env.SECRET);
        req.user = openToken.user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalido o expirado', error });
    }
}

module.exports = auth;