module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'menus',
      'deletedAt',
      {
        allowNull: true,
        type: Sequelize.DATE,
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('menus', 'deletedAt');
  },
};
