// Definición del modelo Post

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Post',
		{ pos_titulo:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Título"}}
			},
			pos_url:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta url"}}
			},
      pos_contenido:  {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta url"}}
      },
      pos_resumen:  {
        type: DataTypes.STRING,
        validate: {notEmpty: {msg: "-> Falta url"}}
      }
		});
}
