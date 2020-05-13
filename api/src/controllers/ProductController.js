const { Product, ProductPhoto } = require('../models');

module.exports = {
    async store(req, res) {
        try {
            const {
                name, description, SizeId,
                BrandId, stock, price, SubcategoryId
            } = req.body, { UserId } = req.headers;

            
            const { id } = await Product.create({
                name, description, SizeId, SubcategoryId,
                BrandId, stock, price, ProviderId: UserId
            });

            if (req.files) {
                let tmp = [];
                (req.files).forEach(el => {
                    tmp.push({
                        photoUrl: el.location,
                        ProductId: id
                    });
                });
                await ProductPhoto.bulkCreate(tmp);
            }
          
            res.status(200).send({ status: true, response: id, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            console.log(err);
            res.status(500).send({ status: false, response: err, code: 22 });
        }
    },

    async update(req, res) {
        try {
            const {
                name, description, SizeId,
                BrandId, stock, price
            } = req.body, { id } = req.params;

            const query = await Product.update(
                { name, description, SizeId, SubcategoryId,
                BrandId, stock, price },
                { where: { id } });

            if (req.files) {
                let tmp = [];
                (req.files).forEach(el => {
                    tmp.push({
                        photoUrl: el.location,
                        ProductId: id
                    });
                });
                await ProductPhoto.bulkCreate(tmp);
            }
          
            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            console.log(err);
            res.status(500).send({ status: false, response: err, code: 22 });
        }
    }
}