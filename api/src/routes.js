const express = require('express');
const jwt = require('jsonwebtoken');
const routes = express.Router();

const multer = require('multer');
const upload = multer({ 
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/png'
        ]

        if(allowedMimes.includes(file.mimetype)) cb(null, true);
        else cb(new Error("Invalid file tipe."));
    }
})

const UserController = require('./controllers/UserController');
const ProductController = require('./controllers/ProductController');

routes.post('/user', upload.single('file'), UserController.store);

routes.use(verifyJWT);

routes.post('/product', upload.array('files'), ProductController.store);
routes.put('/product/:id', upload.array('files'), ProductController.update);

//Validação de Token para continuar a executar requisição
function verifyJWT(req, res, next) {
    let token = req.headers['token'];

    if (!token) return res.status(200).send({ status: false, response: 'no token' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(200).send({ status: false, response: 'invalid token' });
        req.headers.UserId = decoded.id;        
                
        // se tudo estiver ok, deixa a requisição prosseguir
        next()
    });
}


module.exports = routes;