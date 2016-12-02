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
    return queryInterface.createTable ('Contacts', {
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
      con_contact:  {
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Contact"}}
      },
      con_block:  { // 0: Enviada, 1: Pendiente, 2: Aceptado, 3: Bloqueado, 4: Bloqueador
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Block"}}
      },
      con_message:  { // Identificador de conversación
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Message"}}
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Contacts');
  }
};
