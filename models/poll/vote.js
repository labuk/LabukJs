// Definición del modelo Vote

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Vote',
			{ vot_voto:  {
					type: DataTypes.INTEGER,
					validate: {notEmpty: {msg: "-> Falta Voto"}}
				}
		});
}
