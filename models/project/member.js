// Definición del modelo Project

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Member',
		{ mem_rol:  {
			type: DataTypes.INTEGER,
			validate: {notEmpty: {msg: "-> Falta Rol"}}
			}
		});
}
