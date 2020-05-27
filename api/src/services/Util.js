const jwt = require('jsonwebtoken');

module.exports = {
    decodeToken(token) {
        return jwt.verify(token, process.env.SECRET_TOKEN, function (err, decoded) {  
            if (err) return null;
            else return { UsuarioId: decoded.id, UsuarioPermissao: decoded.usr_permissao };
        });
    }
}