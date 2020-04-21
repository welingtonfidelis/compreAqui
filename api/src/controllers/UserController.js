const { User } = require('../models');

module.exports = {
    async store(req, res) {
        try {
            const { 
                name, doc, email, phone1, phone2, user, 
                birth, password, passwordConfirm, type, cep, state, 
                city, district, street, complement
            } = req.body;
            
            let photoUrl = null;
            if(req.file) photoUrl = req.file.location;

            const query = await User.create({
                name, doc, email, phone1, phone2, user, 
                birth, password, passwordConfirm, type, cep, state, 
                city, district, street, complement, photoUrl
            });
            
            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            console.log(err);
            res.status(500).send({ status: false, response: err, code: 22 });
        }
    }
}