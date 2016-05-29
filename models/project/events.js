// Definición del modelo Events - Utilizo la "s" porque event en js es un objeto global.

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Events',
		{ eve_evento:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta Evento"}}
			},
			eve_url:  {
					type: DataTypes.STRING
				},
			eve_tipo:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Estado"}}
			},
			eve_date:  {
				type: DataTypes.DATE,
				validate: {notEmpty: {msg: "-> Falta Fecha"}}
			}
		});
}
