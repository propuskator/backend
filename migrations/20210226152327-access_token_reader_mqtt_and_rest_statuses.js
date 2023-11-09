'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('accessTokenReaders', 'brokerStateStatus', {
      type         : Sequelize.STRING(),
      allowNull    : true,
      defaultValue : null
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('accessTokenReaders', 'brokerStateStatus');
  }
};
