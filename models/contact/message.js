// Definición del modelo message

module.exports = function(sequelize, DataTypes){
	return sequelize.define('message',
		{ mes_message:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Message"}}
      },
      mes_read:  {
  			type: DataTypes.BOOLEAN,
  			validate: {notEmpty: {msg: "-> Falta Read"}}
      },
			mes_recivier: {
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta Destinatario"}}
			}
		});
}