var path = require('path');

//Postgres DATABASE_URL = postgres://user:passwd@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd,
	{dialect: dialect,
	 protocol: protocol,
	 port: port,
  	 host: host,
	 storage: storage,
	 omitNull: true
});

// Importar la definición de la tabla User en user.js
var user_path = path.join(__dirname, 'user')
var User = sequelize.import(user_path);

// Importar la definición de la tabla Quiz en quiz.js
var quiz_path = path.join(__dirname, 'quiz')
var Quiz = sequelize.import(quiz_path);

// Importar la definición de la tabla Comment en comment.js
var comment_path = path.join(__dirname, 'comment')
var Comment = sequelize.import(comment_path);

// Relación Quiz - Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Relación User - Quiz/Comment
Quiz.belongsTo(User);
User.hasMany(Quiz);
Comment.belongsTo(User);
User.hasMany(Comment);

// Sección de Project
// Importar la definición de la tabla Proyect en project/proyect.js
var project_path = path.join(__dirname, 'project/project')
var Project = sequelize.import(project_path);
// Importar la definición de la tabla Piece en project/piece.js
var piece_path = path.join(__dirname, 'project/piece')
var Piece = sequelize.import(piece_path);
	// Relación Piece - Project
	Piece.belongsTo(Project);
	Project.hasMany(Piece);
	Piece.belongsTo(User);

// Fin -- Project

exports.User = User; // exportar definición de tabla Comment
exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment; // exportar definición de tabla Comment
exports.Project = Project; // exportar definición de tabla Project
exports.Piece = Piece; // exportar definición de tabla Comment

// sequelize.sync() crea e inicializa la tabla en DB
sequelize.sync().then(function() {
	// succes(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count){
		if (count === 0){ // la tabla se inicializa solo si está vacía
			User.create({
			  nombre: 'Admin',
			  pass: '1234'
			});
			Quiz.create({
			  pregunta: 'Capital de Italia',
			  respuesta: 'Roma',
			  tematica: 'Humanidades',
			  UserId: '1'
			})
			.then(function(){console.log('Base de datos inicializada')});
		};
	});

	Project.count().then(function (count){
		if (count === 0){ // la tabla se inicializa solo si está vacía
			Project.create({
				pro_nombre: 'Labuk',
				pro_url: 'labuk'
			});
			Piece.create({
				pie_nombre: 'General',
				pie_url: 'general'
			})
			.then(function(){console.log('Base de datos inicializada')});
		};

	});
});
