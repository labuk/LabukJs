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
    return queryInterface.createTable ('Members', {
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
      mem_rol:  { //0- Admin, 1- Miembro, 2- Colaborador, 3- Seguidor
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Rol"}}
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
    return queryInterface.dropTable('Members');
  }
};
