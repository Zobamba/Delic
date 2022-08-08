module.exports = (sequelize, DataTypes) => {
  const OrderMeal = sequelize.define('orderMeal', {
    orderId: DataTypes.INTEGER,
    mealId: DataTypes.INTEGER,
  });
  OrderMeal.associate = (models) => {
    OrderMeal.belongsTo(models.meal, {
      foreignKey: 'orderId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }; 
  
  return MenuMeal;
};