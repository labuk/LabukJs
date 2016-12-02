'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      nombre:  {
        type: DataTypes.STRING,
        unique: true,
        validate: {notEmpty: {msg: "-> Falta Nombre"}}
      },
      pass: {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta Contraseña"}}
      },
      avatar: {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta Avatar"}}
      },
      online:  {
        type: DataTypes.BOOLEAN
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Users');
  }
};
