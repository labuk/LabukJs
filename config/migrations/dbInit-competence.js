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
    return queryInterface.createTable ('Competences', {
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
      com_competencia:  {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta Competencia"}}
      },
      com_descripcion:  {
          type: DataTypes.TEXT,
          validate: {notEmpty: {msg: "-> Falta Competencia"}}
      },
      com_tipo:  { //0-Educación, 1-Experiencia, 2-Habilidades, 3-Aptitudes
        type: DataTypes.INTEGER,
        validate: {notEmpty: {msg: "-> Falta tipo"}}
      },
      com_valor:  {
        type: DataTypes.INTEGER
      },
      com_date:  {
        type: DataTypes.DATE
      },
      UserId: {
        allowNull: false,
        type: DataTypes.INTEGER
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Competences');
  }
};
