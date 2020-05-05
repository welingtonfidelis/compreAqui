'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert({ tableName: 'Users' },
            [
                {
                    name: 'Comercial 1',
                    email: 'comercial1@email.com',
                    phone1: '(35) 9 9999-9999',
                    phone2: '(35) 3521-2222',
                    doc: '00.000.000/0001-00',
                    user: 'comercial1',
                    birth: '1990-07-28 00:00:00',
                    password: '$2b$10$Dtan5DFEMqV0FC8n6vXVBedlz6pvDwncYcBPTOxCvX5kSVtkr3eYS',
                    type: 'comercial',
                    AddressId: Math.floor(Math.random() * 5) + 1,
                    CategoryId: 1,
                    photoUrl: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'Comercial 2',
                    email: 'comercial2@email.com',
                    phone1: '(35) 9 9999-9999',
                    phone2: '(35) 3521-2222',
                    doc: '00.000.000/0001-01',
                    user: 'comercial2',
                    birth: '1990-07-28 00:00:00',
                    password: '$2b$10$Dtan5DFEMqV0FC8n6vXVBedlz6pvDwncYcBPTOxCvX5kSVtkr3eYS',
                    type: 'comercial',
                    AddressId: Math.floor(Math.random() * 5) + 1,
                    CategoryId: 1,
                    photoUrl: null,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'User 1',
                    email: 'user1@email.com',
                    phone1: '(35) 9 9999-9999',
                    phone2: '(35) 3521-2222',
                    doc: '000.000.000-00',
                    user: 'user1',
                    birth: '1990-07-28 00:00:00',
                    password: '$2b$10$Dtan5DFEMqV0FC8n6vXVBedlz6pvDwncYcBPTOxCvX5kSVtkr3eYS',
                    type: 'client',
                    photoUrl: null,
                    AddressId: Math.floor(Math.random() * 5) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    name: 'User 2',
                    email: 'user2@email.com',
                    phone1: '(35) 9 9999-9999',
                    phone2: '(35) 3521-2222',
                    doc: '000.000.000-01',
                    user: 'user2',
                    birth: '1990-07-28 00:00:00',
                    password: '$2b$10$Dtan5DFEMqV0FC8n6vXVBedlz6pvDwncYcBPTOxCvX5kSVtkr3eYS',
                    type: 'client',
                    photoUrl: null,
                    AddressId: Math.floor(Math.random() * 5) + 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },

            ])
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete({ tableName: 'Users' },
            [{
                AddressId: 1
            }])
    }
};
