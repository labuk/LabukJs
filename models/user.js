// Definición del modelo Quiz

module.exports = function(sequelize, DataTypes){
	return sequelize.define('User',
		{ nombre:  {
			type: DataTypes.STRING,
			unique: true,
			validate: {notEmpty: {msg: "-> Falta Nombre"}}
		  },
		  pass: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Contraseña"}}
			},
			avatar: {
			type: DataTypes.STRING,
			validate: {notEmpty: {msg: "-> Falta Avatar"}}
			},
      online:  {
  		type: DataTypes.BOOLEAN
      }
		});
}
