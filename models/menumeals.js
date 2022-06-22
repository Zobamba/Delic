module.exports = (sequelize, DataTypes) => {
  const MenuMeal = sequelize.define('menuMeal', {
    menuId: DataTypes.INTEGER,
    mealId: DataTypes.INTEGER,
  });
  MenuMeal.associate = (models) => {
    MenuMeal.belongsTo(models.meal, {
      foreignKey: 'mealId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }; 
  
  return MenuMeal;
};