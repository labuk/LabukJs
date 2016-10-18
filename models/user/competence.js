// Definición del modelo competence

module.exports = function(sequelize, DataTypes){
	return sequelize.define('Competence',
		{ com_competencia:  {
				type: DataTypes.STRING,
				validate: {notEmpty: {msg: "-> Falta Competencia"}}
			},
      com_descripcion:  {
  				type: DataTypes.TEXT,
  				validate: {notEmpty: {msg: "-> Falta Competencia"}}
  			},
			com_tipo:  { //0-Educación, 1-Experiencia, 2-Habilidades, 3-Aptitudes
				type: DataTypes.INTEGER,
				validate: {notEmpty: {msg: "-> Falta tipo"}}
			},
      com_valor:  {
        type: DataTypes.INTEGER
      },
      com_date:  {
				type: DataTypes.DATE
			}
		});
}
