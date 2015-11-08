// Definición del modelo Ideas

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Idea',
		{ ide_idea:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Idea"}}
			}
		});
}
