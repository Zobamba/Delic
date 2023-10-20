module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('order', {
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, { paranoid: true });
  Order.associate = (models) => {
    Order.belongsTo(models.user, {
      foreignKey: 'userId',
    });
    Order.belongsToMany(models.meal, {
      through: 'orderMeal',
      foreignKey: 'orderId',
      otherKey: 'mealId',
    });
  };
  return Order;
};
