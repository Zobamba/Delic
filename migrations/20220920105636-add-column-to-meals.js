module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'meals',
      'deletedAt',
      {
        allowNull: true,
        type: Sequelize.DATE,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('meals', 'deletedAt');
  },
};
