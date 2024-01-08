module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users',
      'photoUrl',
      {
        type: Sequelize.STRING,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'photoUrl');
  },
};
