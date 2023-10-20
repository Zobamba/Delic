module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'users',
      'phoneNumber',
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'users',
      'phoneNumber',
      {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
    );
  },
};
