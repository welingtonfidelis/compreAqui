const { User, Address } = require('../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Upload = require('../services/Upload');

module.exports = {
    async store(req, res) {
        try {
            const { 
                name, doc, email, phone1, phone2, user, number, 
                birth, type, cep, state, CategoryId,
                city, district, street, complement
            } = req.body;

            const password = bcrypt.hashSync(req.body.password, saltRounds);

            let photoUrl = null;
            if(req.file) {
                const file = await Upload.uploadImage(req.file, 'profile', doc);
                photoUrl = file.Location;
            }

            let query = await Address.create({
                cep, state, city, district,
                street, complement, number,
            });
            const AddressId = query.dataValues.id;

            query = await User.create({
                name, doc, email, phone1, phone2, user, photoUrl,
                birth, password, type, AddressId, CategoryId
            });
            
            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            console.warn(err);
            res.status(500).send({ status: false, response: err, code: 22 });
        }
    }
}