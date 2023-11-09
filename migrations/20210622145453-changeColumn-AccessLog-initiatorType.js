'use strict';

const TABLE_NAME      = 'accesslogs';
const COLUMN_NAME     = 'initiatorType';
const INITIATOR_TYPES = [ 'PHONE', 'SUBJECT', 'ACCESS_POINT' ];

module.exports = {
    up : (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(TABLE_NAME, COLUMN_NAME, {
            type      : Sequelize.ENUM(INITIATOR_TYPES),
            allowNull : false
        });
    },

    down : (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(TABLE_NAME, COLUMN_NAME, {
            type      : Sequelize.ENUM(INITIATOR_TYPES),
            allowNull : true
        });
    }
};
