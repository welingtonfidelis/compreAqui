const { AuthenticationError, ValidationError } = require('apollo-server-core');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');
const { Address } = require('../models');

const notAuthorized = () => {
    return new AuthenticationError('Invalid token');
}

const invalidLogin = () => {
    return new ValidationError('Invalid user or password');
}

module.exports = {
    Query: {
        sessionSign: async (_, args) => {
            try {
                const { user, password } = args;

                const query = await User.findOne({
                    where: {
                        [Op.or]: [{ user }, { email: user }]
                    },
                    attributes: ['id', 'name', 'password']
                });

                if (query) {
                    const { id, name } = query, hash = query.password;

                    const isValid = await bcrypt.compareSync(password, hash);

                    if (isValid) {
                        const token = jwt.sign({ id }, process.env.SECRET, {
                            // expiresIn: '12h'
                        })
                     
                        return {name, token};
                    }
                }

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                console.log(err);
            }

            return invalidLogin();
        },
        userIndex: async (_, args) => {

            if (args.UserId) {
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
                            }
                        ]
                    });
                    // console.log("All users:", JSON.stringify(query, null, 2));

                } catch (error) {
                    const err = error.stack || error.errors || error.message || error;
                    console.log(err);
                }

                return query;

            } else return notAuthorized();
        },
        userShow: async (_, args) => {
            if (args.UserId) {
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

            } else return notAuthorized();
        }
    },

    Mutation: {
        userStore: async (_, args) => {
            let query = null;

            try {
                const {
                    name, doc, email, phone1, phone2, user, birth, password, type,
                    cep, state, city, district, street, complemen, number,
                } = args;

                query = await Address.create({
                    cep, state, city, district,
                    street, complemen, number,
                });

                const AddressId = query.dataValues.id;

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
            if (args.UserId) {
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

            } else return notAuthorized();
        },
        userDelete: async (_, args) => {
            if (args.UserId) {
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

            } else return notAuthorized();
        }
    }
};