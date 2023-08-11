module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'meals',
      'price2',
      {
        type: Sequelize.DataTypes.INTEGER,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('meals', 'price2');
  },
};
