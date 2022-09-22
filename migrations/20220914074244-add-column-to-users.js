module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users',
      'disable',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'disable');
  },
};
