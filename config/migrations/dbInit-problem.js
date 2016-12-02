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
    return queryInterface.createTable ('Problems', {
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
      prb_problema:  {
        type: DataTypes.TEXT,
        validate: {notEmpty: {msg: "-> Falta Problema"}}
      },
      prb_estado:  { // 0 - Sin solución, 1 - Solucionado
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Estado"}}
      },
      ProjectId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      PieceId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Problems');
  }
};
