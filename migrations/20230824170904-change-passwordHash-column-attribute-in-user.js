module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'users',
      'passwordHash',
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'users',
      'passwordHash',
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    );
  },
};
