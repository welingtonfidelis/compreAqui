'use strict';

const faker = require('faker');
faker.locale = 'pt_BR';

module.exports = {
    up: (queryInterface, Sequelize) => {
        const users = [];
        for(let i = 0; i <= 17; i++) {
            users.push(
                {
                    name: faker.company.companyName(),
                    email: `comercial${i}@email.com`,
                    phone1: faker.phone.phoneNumber(),
                    phone2: faker.phone.phoneNumber(),
                    doc: `00.000.000/0001-${(i+'').padStart(2, 0)}`,
                    user: `comercial${i}`,
                    birth: '1990-07-28 00:00:00',
                    password: '$2b$10$Dtan5DFEMqV0FC8n6vXVBedlz6pvDwncYcBPTOxCvX5kSVtkr3eYS',
                    type: 'comercial',
                    AddressId: Math.floor(Math.random() * 5) + 1,
                    CategoryId: 1,
                    photoUrl: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            )
        }

        for(let i = 0; i < 5; i++) {
            users.push(
                {
                    name: faker.name.findName(),
                    email: `user${i}@email.com`,
                    phone1: faker.phone.phoneNumber(),
                    phone2: faker.phone.phoneNumber(),
                    doc: `000.000.000-${(i+'').padStart(2, 0)}`,
                    user: `user${i}`,
                    birth: '1990-07-28 00:00:00',
                    password: '$2b$10$Dtan5DFEMqV0FC8n6vXVBedlz6pvDwncYcBPTOxCvX5kSVtkr3eYS',
                    type: 'client',
                    AddressId: Math.floor(Math.random() * 5) + 1,
                    photoUrl: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            )
        }

        return queryInterface.bulkInsert({ tableName: 'Users' }, users)
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete({ tableName: 'Users' },
            [{
                AddressId: 1
            }])
    }
};
