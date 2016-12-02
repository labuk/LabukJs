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
    return queryInterface.createTable ('Events', {
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
      eve_evento:  {
        type: DataTypes.TEXT,
        validate: {notEmpty: {msg: "-> Falta Evento"}}
      },
      eve_url:  {
          type: DataTypes.STRING
        },
      eve_tipo:  {
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Estado"}}
      },
      eve_date:  {
        type: DataTypes.DATE,
        validate: {notEmpty: {msg: "-> Falta Fecha"}}
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      ProjectId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Events');
  }
};
