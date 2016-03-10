// Definición del modelo contact

module.exports = function(sequelize, DataTypes){
	return sequelize.define('contact',
		{ con_contact:  {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Contact"}}
      },
      con_block:  { // 0: Enviada, 1: Pendiente, 2: Aceptado, 3: Bloqueado
  			type: DataTypes.INTEGER,
  			validate: {notEmpty: {msg: "-> Falta Block"}}
      }

		});
}
