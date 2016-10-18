// Definición del modelo Task

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Task',
		{ tas_tarea:  {
				type: DataTypes.TEXT,
				validate: {notEmpty: {msg: "-> Falta Tarea"}}
			},
			tas_estado:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Estado"}}
			},
			tas_todos: {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Estado"}}
			}
		});
}
