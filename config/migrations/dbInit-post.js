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
    return queryInterface.createTable ('Posts', {
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
      pos_titulo:  {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta Título"}}
      },
      pos_url:  {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta url"}}
      },
      pos_contenido:  {
        type: DataTypes.TEXT,
        validate: {notEmpty: {msg: "-> Falta url"}}
      },
      pos_resumen:  {
        type: DataTypes.TEXT,
        validate: {notEmpty: {msg: "-> Falta url"}}
      },
      pos_publica:  {
        type: DataTypes.BOOLEAN,
        validate: {notEmpty: {msg: "-> Falta Pública"}}
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
    return queryInterface.dropTable('Posts');
  }
};
