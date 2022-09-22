module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('meals', 'meals_name_key')
  },

  async down(migration, DataTypes, done) {
    migration.changeColumn(
      'meals',
      'name',
      {
        type: DataTypes.STRING,
        unique: true
      }
    ).done(done);
  },
};
