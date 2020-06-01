const { Product, ProductPhoto } = require('../models');

const Upload = require('../services/Upload');

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
                for (const el of req.files) {
                    const file = await Upload.uploadImage(el, 'products', id);
                    tmp.push({
                        photoUrl: file.Location,
                        ProductId: id
                    });
                }

                ProductPhoto.bulkCreate(tmp);
            }

            res.status(200).send({ status: true, response: id, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            console.warn(err);
            res.status(500).send({ status: false, response: err, code: 22 });
        }
    },

    async update(req, res) {
        try {
            const {
                name, description, SizeId,
                BrandId, stock, price, SubcategoryId
            } = req.body, { id } = req.params;

            const query = await Product.update(
                {
                    name, description, SizeId, SubcategoryId,
                    BrandId, stock, price
                },
                { where: { id } });

            if (req.files) {
                let tmp = [];
                for (const el of req.files) {
                    const file = await Upload.uploadImage(el, 'products', id);
                    tmp.push({
                        photoUrl: file.Location,
                        ProductId: id
                    });
                }

                ProductPhoto.bulkCreate(tmp);
            }

            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            console.warn(err);
            res.status(500).send({ status: false, response: err, code: 22 });
        }
    }
}