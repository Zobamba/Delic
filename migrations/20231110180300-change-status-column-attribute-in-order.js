module.exports = {
  async up(queryInterface, Sequelize) {
  //   await queryInterface.sequelize.query(`
  //   UPDATE orders
  //   SET status = 'pending'
  //   WHERE status IS NULL;
  // `);

    await queryInterface.changeColumn(
      'orders',
      'status',
      {
        type: Sequelize.STRING,
        allowNull: true,
        status: {
          type: Sequelize.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
          allowNull: true,
          defaultValue: 'Pending',
        },
      },
    );
  },

  async down(queryInterface, Sequelize) {
    queryInterface.changeColumn(
      'orders',
      'status',
      {
        type: Sequelize.STRING,
        status: {
          type: Sequelize.ENUM('open', 'closed', 'processing', 'pending', 'archived'),
        },
        allowNull: true,
      },
    );
  },
};
