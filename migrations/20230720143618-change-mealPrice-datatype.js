module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'meals',
      'price',
      {
        type: Sequelize.DataTypes.STRING,
      },
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'meals',
      'price',
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
    );
  },
};
