// Definición del modelo Logs

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Log',
		{ log_entrada:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta Log"}}
			},
			log_tipo:  { // 0- Usuario, 10- Noticia Publica, 11- Noticia Privada, 12- Problema, 13- Notas
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Tipo"}}
			},
			log_url:  {
					type: DataTypes.STRING
			}
		});
}
