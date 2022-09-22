module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'orders',
      'deletedAt',
      {
        allowNull: true,
        type: Sequelize.DATE,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'deletedAt');
  },
};
