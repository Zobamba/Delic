module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn(
      'orders',
      'state',
      'status',
    );
  },

  async down(queryInterface) {
    await queryInterface.renameColumn(
      'orders',
      'status',
      'state',
    );
  },
};
