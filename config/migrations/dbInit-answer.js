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
    return queryInterface.createTable ('Answers', {
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
      ans_solucion:  {
        type: DataTypes.TEXT,
        validate: {notEmpty: {msg: "-> Falta Solución"}}
      },
      ans_estado:  {
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Estado"}}
      },
      ProblemId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Answers');
  }
};
