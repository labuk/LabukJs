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
    return queryInterface.createTable ('Logs', {
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
      log_entrada:  {
        type: DataTypes.TEXT,
        validate: {notEmpty: {msg: "-> Falta Log"}}
      },
      log_tipo:  { // 0- Usuario, 10- Noticia Publica, 11- Noticia Privada, 12- Problema, 13- Notas
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta Tipo"}}
      },
      log_url:  {
          type: DataTypes.STRING
      },
      ProjectId: {
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
    return queryInterface.dropTable('Logs');
  }
};
