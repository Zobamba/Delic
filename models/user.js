
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('users', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    admin: DataTypes.BOOLEAN,
    passwordHash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};
