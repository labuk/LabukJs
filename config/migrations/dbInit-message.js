// Hay que añadir "s" a la tabla al crearla.
/*
// Para asociar
UserId: {
  allowNull: false,
  type: DataTypes.INTEGER
}
*/
'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable ('Messages', {
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
      mes_message:  {
        type: DataTypes.TEXT,
        validate: {notEmpty: {msg: "-> Falta Message"}}
      },
      mes_topic:  {
          type: DataTypes.STRING,
          validate: {notEmpty: {msg: "-> Falta topic"}}
      },
      mes_read:  {
        type: DataTypes.BOOLEAN,
        validate: {notEmpty: {msg: "-> Falta Read"}}
      },
      mes_recivier: {
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Destinatario"}}
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      ContactId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Messages');
  }
};
