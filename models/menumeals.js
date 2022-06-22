'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menuMeals extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  menuMeals.init({
    mealId: DataTypes.INTEGER,
    menuId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'menuMeals',
  });
  return menuMeals;
};