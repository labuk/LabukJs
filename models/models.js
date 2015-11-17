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

// Sección de Project
// Importar la definición de la tabla Proyect en project/proyect.js
var project_path = path.join(__dirname, 'project/project')
var Project = sequelize.import(project_path);
// Importar la definición de la tabla Member en project/member.js
var member_path = path.join(__dirname, 'project/member')
var Member = sequelize.import(member_path);
	// Relación Member - Project/User
	Member.belongsTo(User);
	Member.belongsTo(Project);
// Importar la definición de la tabla Piece en project/piece.js
var piece_path = path.join(__dirname, 'project/piece')
var Piece = sequelize.import(piece_path);
	// Relación Piece - Project/User
	Piece.belongsTo(Project);
	Piece.belongsTo(User);
// Importar la definición de la tabla Task en project/task.js
var task_path = path.join(__dirname, 'project/task')
var Task = sequelize.import(task_path);
	// Relación Task - Piece
	Task.belongsTo(Piece);
	//Task.belongsTo(User);
// Importar la definición de la tabla Log en project/log.js
var log_path = path.join(__dirname, 'project/log')
var Log = sequelize.import(log_path);
	// Relación Log - Project / User
	Log.belongsTo(Project);
	Log.belongsTo(User);
// Importar la definición de la tabla Idea en project/idea.js
var idea_path = path.join(__dirname, 'project/idea')
var Idea = sequelize.import(idea_path);
	// Relación Idea - Project
	Idea.belongsTo(Project);
// Importar la definición de la tabla Idea en project/problem.js
var problem_path = path.join(__dirname, 'project/problem')
var Problem = sequelize.import(problem_path);
	// Relación Problem - Project/Piece
	Problem.belongsTo(Project);
	Problem.belongsTo(Piece);
// Importar la definición de la tabla Idea en project/problem.js
var answer_path = path.join(__dirname, 'project/answer')
var Answer = sequelize.import(answer_path);
	// Relación Answer - Problem
	Answer.belongsTo(Answer);

// Fin -- Project

// Sección Blog
// Importar la definición de la tabla Post en blog/post.js
var post_path = path.join(__dirname, 'blog/post')
var Post = sequelize.import(post_path);
	// Relación Post - Project / User
	Post.belongsTo(Project);
	Post.belongsTo(User);
var comment_path = path.join(__dirname, 'blog/comment')
var Comment = sequelize.import(comment_path);
	// Relación Comment - Post
	Comment.belongsTo(Post);
// Fin -- Blog

// Exportar General DB
exports.User = User; // exportar definición de tabla Comment
// Exportar Project DB
exports.Project = Project; // exportar definición de tabla Project
exports.Piece = Piece; // exportar definición de tabla Piece
exports.Task = Task; // exportar definición de tabla Task
exports.Member = Member; // exportar definición de tabla Member
exports.Log = Log; // exportar definición de tabla Member
exports.Idea = Idea; // exportar definición de tabla Idea
exports.Problem = Problem; // exportar definición de tabla Problem
exports.Answer = Answer; // exportar definición de tabla Idea
// Exportar Blog DB
exports.Post = Post; // exportar definición de tabla Post
exports.Comment = Comment; // exportar definición de tabla Post

// sequelize.sync() crea e inicializa la tabla en DB
sequelize.sync().then(function() {
	// succes(..) ejecuta el manejador una vez creada la tabla

	Project.count().then(function (count){
		if (count === 0){ // la tabla se inicializa solo si está vacía
			User.create({
				nombre: 'Admin',
				pass: '1234'
			});
			User.create({
				nombre: 'Seghis',
				pass: '1234'
			});
			Project.create({
				pro_nombre: 'Labuk',
				pro_url: 'labuk'
			});
			Piece.create({
				pie_nombre: 'General',
				pie_url: 'general'
			});
			Member.create({
				mem_rol:'0',
				UserId:'1',
				ProjectId:'1'
			})
			.then(function(){console.log('Base de datos inicializada')});
		};



	});
});
