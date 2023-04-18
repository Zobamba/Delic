module.exports = {
  async up(queryInterface) {
    await queryInterface.removeConstraint('meals', 'meals_name_key');
  },

  async down(migration, DataTypes) {
    migration.changeColumn(
      'meals',
      'name',
      {
        type: DataTypes.STRING,
        unique: true,
      },
    );
  },
};
