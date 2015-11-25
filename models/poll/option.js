// Definición del modelo Poll

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Option',
		{ opt_respuesta:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Respuesta"}}
			},
			opt_votos:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Votos"}}
			}
		});
}
