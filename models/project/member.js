// Definición del modelo Project

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Member',
		{ mem_rol:  { //0- Admin, 1- Miembro, 2- Colaborador, 3- Seguidor
			type: DataTypes.INTEGER,
			validate: {notEmpty: {msg: "-> Falta Rol"}}
			}
		});
}
