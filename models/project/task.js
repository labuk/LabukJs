// Definición del modelo Pieces

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Task',
		{ tas_tarea:  {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Tarea"}}
			}
		});
}
