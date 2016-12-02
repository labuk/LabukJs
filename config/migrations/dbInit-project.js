// Hay que añadir "s" a la tabla al crearla.

'use strict';
module.exports = {
  up: function(queryInterface, DataTypes) {
    return queryInterface.createTable('Projects', {
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
      pro_nombre:  {
  			type: DataTypes.STRING,
  			validate: {notEmpty: {msg: "-> Falta Nombre"}}
  		},
			pro_eslogan:  {
				type: DataTypes.STRING
			},
			pro_descripcion:  {
				type: DataTypes.TEXT
			},
			pro_tipo:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Tipo"}}
			},
			pro_url:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta url"}}
			},
			pro_portada:  {
				type: DataTypes.INTEGER
			},
			pro_logo:  {
				type: DataTypes.STRING
			}
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Projects');
  }
};
