// Definición del modelo Problem

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Problem',
		{ prb_problema:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Problema"}}
			},
			prb_estado:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Estado"}}
			}
		});
}
