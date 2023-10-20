module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'orders',
      'paymentReference',
      {
        allowNull: true,
        type: Sequelize.STRING,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('orders', 'paymentReference');
  },
};
