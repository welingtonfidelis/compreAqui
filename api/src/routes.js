const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('./services/UploadFile');
const upload = multer(multerConfig);

const UserController = require('./controllers/UserController');

routes.post('/user', upload.single('file') , UserController.store);

module.exports = routes;