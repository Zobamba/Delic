module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn(
      'meals',
      'price2',
      'price',
    );
  },

  async down(queryInterface) {
    await queryInterface.renameColumn(
      'meals',
      'price',
      'price2',
    );
  },
};
