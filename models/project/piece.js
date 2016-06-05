// Definición del modelo Pieces

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Piece',
		{ pie_nombre:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Nombre"}}
			},
			pie_descripcion:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta descripcion"}}
				},
			pie_url:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta url"}}
			},
			pie_prioridad:  { // 0- General, 1- Esencial, 2- Util, 3- Laborioso, 4- Desechado
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta prioridad"}}
			}
		});
}
