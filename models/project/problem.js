// Definición del modelo Problem

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Problem',
		{ prb_problema:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta Problema"}}
			},
			prb_estado:  { // 0 - Sin solución, 1 - Solucionado
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Estado"}}
			}
		});
}
