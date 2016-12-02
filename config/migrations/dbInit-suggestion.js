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
    return queryInterface.createTable ('Suggestions', {
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
      sug_sugerencia:  {
        type: DataTypes.TEXT,
        validate: {notEmpty: {msg: "-> Falta Sugerencia"}}
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
    return queryInterface.dropTable('Suggestions');
  }
};
