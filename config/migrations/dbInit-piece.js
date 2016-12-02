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
    return queryInterface.createTable ('Pieces', {
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
      pie_nombre:  {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta Nombre"}}
      },
      pie_descripcion:  {
        type: DataTypes.TEXT,
        validate: {notEmpty: {msg: "-> Falta descripcion"}}
        },
      pie_url:  {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta url"}}
      },
      pie_prioridad:  { // 0- General, 1- Esencial, 2- Util, 3- Laborioso, 4- Desechado
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta prioridad"}}
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
    return queryInterface.dropTable('Pieces');
  }
};
