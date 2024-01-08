module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      defaultValue: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },
    },
  });
  user.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneNumber: DataTypes.INTEGER,
    photoUrl: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    passwordHash: DataTypes.STRING,
    recoveryPasswordId: DataTypes.STRING,
    disable: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'user',
  });
  user.associate = (models) => {
    user.hasMany(models.meal);
    user.hasMany(models.menu);
  };
  return user;
};
