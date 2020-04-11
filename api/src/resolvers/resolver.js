const { AuthenticationError, ValidationError } = require('apollo-server-core');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { Address } = require('../models');
const { Brand } = require('../models');
const { Size } = require('../models');
const { Product } = require('../models');
const { Category } = require('../models');
const { Subcategory } = require('../models');
const { Request } = require('../models');
const { RequestProduct } = require('../models');

const saltRounds = 10;

const isAuthenticated = (args) => {
    if (!args.UserId) return new AuthenticationError('Invalid token');
    else return null;
}

const invalidLogin = () => {
    return new ValidationError('Invalid user or password');
}

module.exports = {

    // =====================>>  QUERY  <<=====================//

    Query: {
        //===========> LOGIN <============//
        sessionSign: async (_, args) => {
            try {
                const { user, password } = args;

                const query = await User.findOne({
                    where: {
                        [Op.or]: [{ user }, { email: user }]
                    },
                    attributes: ['id', 'name', 'password', 'type']
                });

                if (query) {
                    const { id, name, type } = query, hash = query.password;

                    const isValid = await bcrypt.compareSync(password, hash);

                    if (isValid) {
                        const token = jwt.sign({ id, typeUser: type }, process.env.SECRET, {
                            // expiresIn: '12h'
                        })

                        return { name, token, typeUser: type };
                    }
                }

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return invalidLogin();
        },

        //===========> USUÁRIO <============//
        userIndex: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                query = await User.findAll({
                    order: [['name', 'ASC']],
                    include: [
                        {
                            model: Address,
                            attributes: [
                                "id", "cep", "state",
                                "city", "district", "street",
                                "complement", "number"
                            ]
                        },
                        {
                            model: Category,
                            attributes: [
                                "id", "name"
                            ]
                        },
                        {
                            model: Subcategory,
                            attributes: [
                                "id", "CategoryId", "name"
                            ]
                        }
                    ]
                });
                // console.log("All users:", JSON.stringify(query, null, 2));

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        userShow: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id } = args;

                query = await User.findOne({
                    where: {
                        id
                    },
                    include: [
                        {
                            model: Address,
                            attributes: [
                                "id", "cep", "state",
                                "city", "district", "street",
                                "complement", "number"
                            ]
                        }
                    ]
                })

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> MARCA <============//
        brandIndex: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                query = await Brand.findAll({
                    where: {
                        ProviderId: args.UserId
                    },
                    order: [['description', 'ASC']]
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> TAMANHO <============//
        sizeIndex: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                query = await Size.findAll({
                    where: {
                        ProviderId: args.UserId
                    },
                    order: [['description', 'ASC']]

                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> PRODUTO <============//
        productIndex: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const ProviderId = args.ProviderId ? args.ProviderId : args.UserId;
                query = await Product.findAll({
                    where: {
                        ProviderId
                    },
                    order: [['description', 'ASC']],
                    include: [
                        {
                            model: User,
                            as: "Provider"
                        }
                    ]

                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        productShow: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id } = args;
                query = await Product.findOne({
                    where: {
                        id
                    },
                    include: [
                        {
                            model: User,
                            as: "Provider"
                        }
                    ]

                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> PEDIDO <============//
        requestIndex: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { UserId, typeUser } = args;

                if (typeUser === 'user') {
                    query = await Request.findAll({
                        where: {
                            ClientId: UserId
                        },
                        order: [['createdAt', 'DESC']],
                        include: [
                            {
                                model: User,
                                as: "Provider",
                                include: [
                                    {
                                        model: Address
                                    }
                                ]
                            },
                            {
                                model: RequestProduct,
                                include: [
                                    {
                                        model: Product
                                    }
                                ]
                            }
                        ]

                    });
                }
                else {
                    query = await Request.findAll({
                        where: {
                            ProviderId: UserId
                        },
                        order: [['createdAt', 'DESC']],
                        include: [
                            {
                                model: User,
                                as: "Client",
                                include: [
                                    {
                                        model: Address
                                    }
                                ]
                            },
                            {
                                model: RequestProduct,
                                include: [
                                    {
                                        model: Product
                                    }
                                ]
                            }
                        ]

                    });
                }


                //console.log("All users:", JSON.stringify(query, null, 2));

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        requestShow: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { UserId, typeUser, id } = args;

                if (typeUser === 'user') {
                    query = await Request.findOne({
                        where: {
                            id
                        },
                        order: [['createdAt', 'DESC']],
                        include: [
                            {
                                model: User,
                                as: "Provider",
                                include: [
                                    {
                                        model: Address
                                    }
                                ]
                            },
                            {
                                model: RequestProduct,
                                include: [
                                    {
                                        model: Product
                                    }
                                ]
                            }
                        ]
                    });
                }
                else {
                    query = await Request.findOne({
                        where: {
                            id
                        },
                        order: [['createdAt', 'DESC']],
                        include: [
                            {
                                model: User,
                                as: "Client",
                                include: [
                                    {
                                        model: Address
                                    }
                                ]
                            },
                            {
                                model: RequestProduct,
                                include: [
                                    {
                                        model: Product
                                    }
                                ]
                            }
                        ]
                    });
                }

                //console.log("All users:", JSON.stringify(query, null, 2));

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
    },

    // =====================>>  MUTATIONS  <<=====================//

    Mutation: {
        //===========> USUÁRIO <============//
        userStore: async (_, args) => {
            let query = null;

            try {
                const {
                    name, doc, email, phone1, phone2, user, birth, type,
                    cep, state, city, district, street, complemen, number,
                } = args;

                query = await Address.create({
                    cep, state, city, district,
                    street, complemen, number,
                });

                const AddressId = query.dataValues.id;
                const password = bcrypt.hashSync(args.password, saltRounds);

                query = await User.create({
                    name, doc, email, phone1, phone2,
                    user, birth, password, type, AddressId
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }
            return query;
        },
        userUpdate: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const {
                    id, name, doc, email, phone1, phone2, user, birth, password, type,
                    AddressId, cep, state, city, district, street, complemen, number,
                } = args;

                query = await Address.update({
                    cep, state, city, district,
                    street, complemen, number,
                },
                    {
                        return: true,
                        where: {
                            id: AddressId
                        }
                    }
                );

                query = await User.update({
                    name, doc, email, phone1, phone2,
                    user, birth, password, type, AddressId
                },
                    {
                        return: true,
                        where: {
                            id
                        }
                    }
                );

                query = query[0];

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }
            return query;
        },
        userDelete: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id } = args;

                query = await User.destroy({
                    where: {
                        id
                    }
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> MARCA <============//
        brandStore: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { UserId, description } = args;

                query = await Brand.create({
                    ProviderId: UserId, description
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        brandUpdate: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id, description } = args;

                query = await Brand.update({
                    description
                },
                    {
                        return: true,
                        where: {
                            id
                        }
                    }
                );

                query = query[0];

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        brandDelete: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id } = args;

                query = await Brand.destroy({
                    where: {
                        id
                    }
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> TAMANHO <============//
        sizeStore: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { UserId, description } = args;

                query = await Size.create({
                    ProviderId: UserId, description
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        sizeUpdate: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id, description } = args;

                query = await Size.update({
                    description
                },
                    {
                        return: true,
                        where: {
                            id
                        }
                    }
                );

                query = query[0];

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        sizeDelete: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id } = args;

                query = await Size.destroy({
                    where: {
                        id
                    }
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> PRODUTO <============//
        productStore: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { UserId, BrandId, SizeId, description,
                    price, stock } = args;

                query = await Product.create({
                    ProviderId: UserId, description, BrandId,
                    SizeId, stock, price
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        productUpdate: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id, BrandId, SizeId, description,
                    price, stock } = args;

                query = await Product.update({
                    BrandId, SizeId, description,
                    price, stock
                },
                    {
                        return: true,
                        where: {
                            id
                        }
                    }
                );

                query = query[0];

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        productDelete: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id } = args;

                query = await Product.destroy({
                    where: {
                        id
                    }
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> PEDIDO <============//
        requestStore: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { UserId, ProviderId, value,
                    delivery, cashBack, products } = args;

                query = await Request.create({
                    ClientId: UserId, ProviderId, timeWait: 0,
                    value, status: 'pending', delivery, cashBack
                });

                const RequestId = query.dataValues.id;
                for (const prod of products) {
                    await RequestProduct.create({
                        RequestId, ProductId: prod.id, amount: prod.amount
                    });

                }

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        requestChangeStatus: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id, status, timeWait } = args;

                query = await Request.update({
                    status, timeWait
                },
                    {
                        return: true,
                        where: {
                            id
                        }
                    }
                );

                query = query[0];

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

    }
};