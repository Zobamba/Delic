module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn(
      'meals',
      'price',
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'meals',
      'price',
      {
        type: Sequelize.DataTypes.INTEGER,
      },
    );
  },
};
