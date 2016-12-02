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
    return queryInterface.createTable ('Tasks', {
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
      tas_tarea:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta Tarea"}}
			},
			tas_estado:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Estado"}}
			},
			tas_todos: {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Estado"}}
			},
      PieceId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Tasks');
  }
};
