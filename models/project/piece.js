// Definición del modelo Pieces

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Piece',
		{ pie_nombre:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Nombre"}}
			},
			pie_url:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta url"}}
			}
		});
}
