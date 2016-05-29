// Definición del modelo Answer

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Answer',
		{ ans_solucion:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta Solución"}}
			},
			ans_estado:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Estado"}}
			}
		});
}
