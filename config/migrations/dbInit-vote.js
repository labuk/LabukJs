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
    return queryInterface.createTable ('Votes', {
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
      vot_voto:  {
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Voto"}}
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      PollId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, DataTypes) {
    return queryInterface.dropTable('Votes');
  }
};
