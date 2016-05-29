// Definición del modelo Poll

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Poll',
		{ pol_pregunta:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta Pregunta"}}
			},
			pol_votos:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Votos"}}
			}
		});
}
