module.exports = (sequelize, DataTypes) => {
  const Menu = sequelize.define('menu', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: new Date().toDateString(),
    },
  }, { paranoid: true });

  Menu.associate = (models) => {
    Menu.belongsTo(models.user, {
      foreignKey: 'userId',
    });
    Menu.belongsToMany(models.meal, {
      through: 'menuMeals',
      foreignKey: 'menuId',
      otherKey: 'mealId',
    });
  };

  return Menu;
};
