module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    userId: DataTypes.INTEGER,
    address: DataTypes.STRING,   
    phoneNumber: DataTypes.INTEGER,
  }, {});
  Order.associate = (models) => {
    Order.belongsTo(models.user);
    Order.belongsToMany(models.meal, { through: models.mealOrder });
  };
  return Order;
};
