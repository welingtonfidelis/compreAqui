const { AuthenticationError, ValidationError } = require('apollo-server-core');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {
    User, Address, Brand, Size,
    Product, Category, Subcategory,
    Request, RequestProduct, State,
    ProductPhoto
} = require('../models');

const saltRounds = 10;

const PushNotifie = require('../services/PushNotif');
const EmailNotifie = require('../services/EmailNotif');

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
        //===========> TESTES <============//
        test: () => {
            return "Hello World"
        },

        //===========> LOGIN <============//
        sessionSign: async (_, args) => {
            try {
                const { user, password, playId } = args;

                const query = await User.findOne({
                    where: {
                        [Op.or]: [{ user }, { email: user }]
                    },
                    attributes: ['id', 'name', 'password', 'type', 'photoUrl', 'playId']
                });


                if (query) {
                    const { id, name, type, photoUrl } = query, hash = query.password;

                    const isValid = await bcrypt.compareSync(password, hash);
                    const typeEncript = bcrypt.hashSync(type, saltRounds);

                    if (isValid) {
                        const token = jwt.sign(
                            { id, typeUser: type }, process.env.SECRET, {}
                        )

                        if (playId && playId != query.playId) {
                            User.update(
                                { playId },
                                { where: { id } }
                            );
                        }

                        return {
                            name, token, photoUrl,
                            typeUser: type, typeUserEncript: typeEncript
                        };
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
            const notAuthenticated = isAuthenticated(args), { page = 1 } = args;
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                query = await User.findAll({
                    order: [['name', 'ASC']],
                    include: [
                        {
                            model: Address,
                        },
                        {
                            model: Category,
                        }
                    ],
                    offset: (page - 1) * 15,
                    limit: 15
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },
        userIndexByCategory: async (_, args) => {
            const notAuthenticated = isAuthenticated(args), { page = 1, CategoryId } = args;
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                query = await User.findAll({
                    where: {
                        CategoryId
                    },
                    order: [['name', 'ASC']],
                    include: [
                        {
                            model: Address,
                        }
                    ],
                    offset: (page - 1) * 15,
                    limit: 15
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

        userShowByDoc: async (_, args) => {
            let query = null;
            try {
                const { doc } = args;

                query = await User.findOne({
                    where: {
                        doc
                    }
                })

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        userShowByEmail: async (_, args) => {
            let query = null;
            try {
                const { email } = args;

                query = await User.findOne({
                    where: {
                        email
                    }
                })

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        userShowByUser: async (_, args) => {
            let query = null;
            try {
                const { user } = args;

                query = await User.findOne({
                    where: {
                        user
                    }
                })

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> MARCA <============//
        brandCount: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { count } = await Brand.findAndCountAll({
                    where: { ProviderId: args.UserId }
                });
                query = count;

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        brandIndex: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { page = 1 } = args;
                query = await Brand.findAll({
                    where: {
                        ProviderId: args.UserId
                    },
                    order: [['brandDescription', 'ASC']],
                    offset: (page - 1) * 15,
                    limit: 15
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        brandShow: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id } = args;
                query = await Brand.findOne({
                    where: { id },
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> TAMANHO <============//
        sizeCount: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { count } = await Size.findAndCountAll({
                    where: { ProviderId: args.UserId }
                });
                query = count;

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        sizeIndex: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { page = 1 } = args;
                query = await Size.findAll({
                    where: {
                        ProviderId: args.UserId
                    },
                    order: [['sizeDescription', 'ASC']],
                    offset: (page - 1) * 15,
                    limit: 15
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        sizeShow: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { id } = args;
                query = await Size.findOne({
                    where: { id },
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> ESTADOS <============//
        stateIndex: async (_, args) => {
            let query = null;
            try {
                query = await State.findAll({
                    order: [['description', 'ASC']]
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> CATEGORIA <============//
        categoryIndex: async (_, args) => {
            let query = null;
            try {
                query = await Category.findAll({
                    order: [['name', 'ASC']]
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> SUBCATEGORIA <============//
        subcategoryIndex: async (_, args) => {
            let query = null;
            try {
                query = await Subcategory.findAll({
                    order: [['name', 'ASC']]
                });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        subcategoryIndexByUser: async (_, args) => {
            let query = null;
            try {
                const { CategoryId } = await User.findOne({
                    where: {
                        id: args.UserId
                    },
                    attributes: ["CategoryId"]
                });

                if (CategoryId) {
                    query = await Subcategory.findAll({
                        where: { CategoryId },
                        order: [['name', 'ASC']]
                    });
                }

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        //===========> PRODUTO <============//
        productCount: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { typeUser, ProviderId, UserId } = args;

                let where = { ProviderId, stock: { [Op.gt]: 0 } };
                if (typeUser === 'comercial') where = { ProviderId: UserId };

                const { count } = await Product.findAndCountAll({ where });
                query = count;

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        productIndex: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { typeUser, ProviderId, UserId, page = 1 } = args;

                let where = { ProviderId, stock: { [Op.gt]: 0 } };
                if (typeUser === 'comercial') where = { ProviderId: UserId };

                query = await Product.findAll({
                    where,
                    order: [['name', 'ASC']],
                    include: [
                        {
                            model: User,
                            as: "Provider"
                        },
                        {
                            model: ProductPhoto
                        }
                    ],
                    offset: (page - 1) * 15,
                    limit: 15
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
                        },
                        {
                            model: ProductPhoto
                        },
                        {
                            model: Brand
                        },
                        {
                            model: Size
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
        requestCount: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { typeUser, UserId, status } = args;

                let where = { ClientId: UserId };
                if (typeUser === 'comercial') where = { ProviderId: UserId };
                if (status) where.status = status;

                const { count } = await Request.findAndCountAll({ where });
                query = count;

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

        requestIndex: async (_, args) => {
            const notAuthenticated = isAuthenticated(args);
            if (notAuthenticated) return notAuthenticated;

            let query = null;
            try {
                const { UserId, typeUser, page = 1, status } = args;

                let where = { ClientId: UserId };
                let include = [
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
                                model: Product,
                                paranoid: false
                            }
                        ]
                    }
                ]
                if (typeUser === 'comercial') {
                    where = { ProviderId: UserId };
                    include[0].as = "Client";
                }
                if (status) where.status = status;

                query = await Request.findAll({
                    where,
                    order: [['createdAt', 'DESC']],
                    include,
                    offset: (page - 1) * 15,
                    limit: 15
                });

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

                let where = { id };
                let include = [
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
                                model: Product,
                                paranoid: false
                            }
                        ]
                    }
                ]
                if (typeUser === 'comercial') {
                    where = { ProviderId: UserId };
                    include[0].as = "Client";
                }

                query = await Request.findOne({
                    where,
                    order: [['createdAt', 'DESC']],
                    include
                });

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
                const { UserId, brandDescription } = args;

                query = await Brand.create({
                    ProviderId: UserId, brandDescription
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
                const { id, brandDescription } = args;

                query = await Brand.update({
                    brandDescription
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
                const { UserId, sizeDescription } = args;

                query = await Size.create({
                    ProviderId: UserId, sizeDescription
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
                const { id, sizeDescription } = args;

                query = await Size.update({
                    sizeDescription
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
                const {
                    UserId, BrandId, SizeId, description,
                    price, stock, name, SubcategoryId
                } = args;

                query = await Product.create({
                    ProviderId: UserId, description, BrandId,
                    SizeId, stock, price, name, SubcategoryId
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
                const {
                    id, BrandId, SizeId, description,
                    price, stock, SubcategoryId
                } = args;

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
                const { UserId, ProviderId, value, cash, observation,
                    delivery, cashBack, products } = args;

                query = await Request.create({
                    ClientId: UserId, ProviderId, timeWait: 0, cash,
                    value, status: 'pending', delivery, cashBack, observation
                });

                const RequestId = query.dataValues.id;
                for (const prod of products) {
                    await RequestProduct.create({
                        RequestId, ProductId: prod.id,
                        amount: prod.amount, price: prod.price
                    });
                }

                const provider = await User.findOne({
                    where: { id: ProviderId },
                    attributes: [
                        "name", "email", "playId", "notifiePush", "notifieEmail"
                    ]
                });

                if (provider) {
                    const { name, email, playId, notifiePush, notifieEmail } = provider;

                    const title = 'Boas notícias 😄';

                    if (email && notifieEmail) {
                        const msg =
                            `
                            Olá <strong>${name}</strong>.</br>
                            Há um novo pedido em sua loja aguardando sua aprovação 
                            (pedido <strong>${RequestId}</strong>).</br>
                            Entre na plataforma web <a href="#">clicando aqui</a> ou no 
                            seu aplicativo para obter mais informações.
                            
                            <p>
                            Boas vendas 💸</br>
                            Atenciosamente, equipe CompreAqui.</br></br>
                            <img 
                                src="https://compreaqui.s3-sa-east-1.amazonaws.com/images/important/logo.png" 
                                style="width: 120px;" 
                            />
                        `;

                        EmailNotifie.sendOneEmail([email], title, msg);
                    }

                    if (playId, notifiePush) {
                        const msg =
                            `Olá ${name}. \n` +
                            `Há um novo pedido em sua loja (pedido ${RequestId}).\n` +
                            `Acesse a plataforma web ou seu app para mais detalhes.`;

                        PushNotifie.sendOnePush([playId], title, msg);
                    }
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
                const { id, status, timeWait, reason = '' } = args;

                query = await Request.update({
                    status, timeWait, reason
                },
                    {
                        return: true,
                        where: {
                            id
                        }
                    }
                );

                query = query[0];

                const request = await Request.findOne({
                    where: { id },
                    attributes: ["id"],
                    include: [
                        {
                            model: RequestProduct,
                            attributes: ["id", "amount", "ProductId"],
                            include: [
                                {
                                    model: Product,
                                    attributes: ["stock"]
                                }
                            ]
                        },
                        {
                            model: User,
                            attributes: [
                                "name", "email", "playId",
                                "notifiePush", "notifieEmail"
                            ],
                            as: 'Client'
                        }
                    ]
                })

                //atualização de estoque e notificação ao usuário
                if (request) {
                    const { RequestProducts, Client } = request;
                    let statusNof = 'aprovado';

                    //Atualiza estoque de pedido aprovado
                    if (status === 'approved') {
                        for (const item of RequestProducts) {
                            const stock = item.Product.stock - item.amount;

                            Product.update(
                                { stock },
                                {
                                    where: {
                                        id: item.ProductId
                                    }
                                }
                            );
                        }
                    }
                    else statusNof = 'recusado';

                    const { name, email, playId, notifiePush, notifieEmail } = Client;

                    const title = status === 'approved' ? 'Boas notícias 😄' : 'Más notíficas 😟';

                    if (email && notifieEmail) {
                        const msg =
                            `
                            Olá <strong>${name}</strong>.</br>
                            Seu pedido (nº <strong>${id}</strong>) foi alterado para ${statusNof}.
                            </br>
                            Entre na plataforma web <a href="#">clicando aqui</a> ou no 
                            seu aplicativo para obter mais informações.
                            
                            <p>
                            Boas compras 🛍️</br>
                            Atenciosamente, equipe CompreAqui.</br></br>
                            <img 
                                src="https://compreaqui.s3-sa-east-1.amazonaws.com/images/important/logo.png" 
                                style="width: 120px;" 
                            />
                        `;

                        EmailNotifie.sendOneEmail([email], title, msg);
                    }

                    if (playId, notifiePush) {
                        const msg =
                            `Olá ${name}. \n` +
                            `Seu pedido nº ${id} foi alterado para ${statusNof}.\n` +
                            `Acesse a plataforma web ou seu app para mais detalhes.`;

                        PushNotifie.sendOnePush([playId], title, msg);
                    }
                }

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return query;
        },

    }
};