// Definición del modelo Pieces

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Piece',
		{ pie_nombre:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Nombre"}}
			},
			pie_descripcion:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta descripcion"}}
				},
			pie_url:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta url"}}
			},
			pie_prioridad:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta prioridad"}}
			}
		});
}
