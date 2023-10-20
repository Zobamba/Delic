module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users',
      'recoveryPasswordId',
      {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'recoveryPasswordId');
  },
};
