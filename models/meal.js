
module.exports = (sequelize, DataTypes) => {
  const Meal = sequelize.define('meal', {
    name: DataTypes.STRING,
    price: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    category: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
  }, {});
  Meal.associate = (models) => {
    Meal.belongsTo(models.user,);
    Meal.belongsToMany(models.menu, { through: 'menuMeals' });
  };
  return Meal;
};