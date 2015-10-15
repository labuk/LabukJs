// Definición del modelo Pieces

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Task',
		{ tas_tarea:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Tarea"}}
			},
			tas_estado:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Estado"}}
			}
		});
}
