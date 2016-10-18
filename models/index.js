// "sequelize":"2.0.0-rc2",

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

// Sección de User
// Importar la definición de la tabla User en user.js
var user_path = path.join(__dirname, 'user')
var User = sequelize.import(user_path);
// Importar la definición de la tabla Competence en user/competence.js
var competence_path = path.join(__dirname, 'user/competence')
var Competence = sequelize.import(competence_path);
	// Relación Member - Project/User
	Competence.belongsTo(User);
		User.hasOne(Competence, {onDelete: 'cascade', hooks:true});

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
		Project.hasOne(Member, {onDelete: 'cascade', hooks:true});

// Importar la definición de la tabla Piece en project/piece.js
var piece_path = path.join(__dirname, 'project/piece')
var Piece = sequelize.import(piece_path);
	// Relación Piece - Project/User
	Piece.belongsTo(Project);
	Piece.belongsTo(User);
		Project.hasOne(Piece, {onDelete: 'cascade', hooks:true});

// Importar la definición de la tabla Task en project/task.js
var task_path = path.join(__dirname, 'project/task')
var Task = sequelize.import(task_path);
	// Relación Task - Piece/User
	Task.belongsTo(Piece);
	Task.belongsTo(User);
		Piece.hasOne(Task, {onDelete: 'cascade', hooks:true});

// Importar la definición de la tabla Notes en project/notes.js
var note_path = path.join(__dirname, 'project/note')
var Note = sequelize.import(note_path);
	// Relación Notes - Piece/User
	Note.belongsTo(Piece);
	Note.belongsTo(User);
		Piece.hasOne(Note, {onDelete: 'cascade', hooks:true});

// Importar la definición de la tabla Log en project/log.js
var log_path = path.join(__dirname, 'project/log')
var Log = sequelize.import(log_path);
	// Relación Log - Project / User
	Log.belongsTo(Project);
		Project.hasOne(Log, {onDelete: 'cascade', hooks:true});
	Log.belongsTo(User);

// Importar la definición de la tabla Idea en project/idea.js
var idea_path = path.join(__dirname, 'project/idea')
var Idea = sequelize.import(idea_path);
	// Relación Idea - Project
	Idea.belongsTo(Project);
		Project.hasOne(Idea, {onDelete: 'cascade', hooks:true});

// Importar la definición de la tabla Idea en project/problem.js
var problem_path = path.join(__dirname, 'project/problem')
var Problem = sequelize.import(problem_path);
	// Relación Problem - Project/Piece
	Problem.belongsTo(Project);
		Project.hasOne(Problem, {onDelete: 'cascade', hooks:true});
	Problem.belongsTo(Piece);
		Piece.hasOne(Problem, {onDelete: 'cascade', hooks:true});

// Importar la definición de la tabla Idea en project/answer.js
var answer_path = path.join(__dirname, 'project/answer')
var Answer = sequelize.import(answer_path);
	// Relación Answer - Problem
	Answer.belongsTo(Problem);
		Problem.hasOne(Answer, {onDelete: 'cascade', hooks:true});

// Importar la definición de la tabla Idea en project/events.js
var events_path = path.join(__dirname, 'project/events')
var Events = sequelize.import(events_path);
	// Relación Answer - Problem
	Events.belongsTo(Project);
		Project.hasOne(Events, {onDelete: 'cascade', hooks:true});
	Events.belongsTo(User);

	// Importar la definición de la tabla Idea en project/suggestion.js
	var suggestion_path = path.join(__dirname, 'project/suggestion')
	var Suggestion = sequelize.import(suggestion_path);
		// Relación Suggestion - Project
		Suggestion.belongsTo(Project);
			Project.hasOne(Suggestion, {onDelete: 'cascade', hooks:true});
		Suggestion.belongsTo(User);

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

// Sección Poll
// Importar la definición de la tabla Post en poll/poll.js
var poll_path = path.join(__dirname, 'poll/poll')
var Poll = sequelize.import(poll_path);
	// Relación Post - Project / User
	Poll.belongsTo(Project);
		Project.hasOne(Poll, {onDelete: 'cascade', hooks:true});
	Poll.belongsTo(User);

// Importar la definición de la tabla Post en poll/option.js
var option_path = path.join(__dirname, 'poll/option')
var Option = sequelize.import(option_path);
	// Relación Post - Project / User
	Option.belongsTo(Poll);
		Poll.hasOne(Option, {onDelete: 'cascade', hooks:true});

// Importar la definición de la tabla Post en poll/vote.js
var vote_path = path.join(__dirname, 'poll/vote')
var Vote = sequelize.import(vote_path);
	// Relación Post - Project / User
	Vote.belongsTo(Poll);
		Poll.hasOne(Vote, {onDelete: 'cascade', hooks:true});
	Vote.belongsTo(User);

// Fin -- Poll

// Sección Contact
// Importar la definición de la tabla Post en contact/contact.js
var contact_path = path.join(__dirname, 'contact/contact')
var Contact = sequelize.import(contact_path);
	// Relación Contact - User
	Contact.belongsTo(User);
// Importar la definición de la tabla Post en contact/message.js
var message_path = path.join(__dirname, 'contact/message')
var Message = sequelize.import(message_path);
	// Relación Message - User
	Message.belongsTo(User);
	Message.belongsTo(Contact);

// Fin -- Contact



// Exportar General DB
exports.User = User; // exportar definición de tabla User
exports.Competence = Competence; // exportar definición de tabla Competence
// Exportar Project DB
exports.Project = Project; // exportar definición de tabla Project
exports.Piece = Piece; // exportar definición de tabla Piece
exports.Task = Task; // exportar definición de tabla Task
exports.Note = Note; // exportar definición de tabla Note
exports.Member = Member; // exportar definición de tabla Member
exports.Log = Log; // exportar definición de tabla Log
exports.Idea = Idea; // exportar definición de tabla Idea
exports.Problem = Problem; // exportar definición de tabla Problem
exports.Answer = Answer; // exportar definición de tabla Answer
exports.Events = Events; // exportar definición de tabla Events
exports.Suggestion = Suggestion; // exportar definición de tabla Suggestion
// Exportar Blog DB
exports.Post = Post; // exportar definición de tabla Post
exports.Comment = Comment; // exportar definición de tabla Comment
// Exportar Poll DB
exports.Poll = Poll; // exportar definición de tabla Poll
exports.Option = Option; // exportar definición de tabla Option
exports.Vote = Vote; // exportar definición de tabla Vote
// Exportar Contact DB
exports.Contact = Contact; // exportar definición de tabla Contact
exports.Message = Message; // exportar definición de tabla Message

// sequelize.sync() crea e inicializa la tabla en DB
// sequelize.drop() para vaciar las tablas
sequelize.sync().then(function() {
	// succes(..) ejecuta el manejador una vez creada la tabla

	Project.count().then(function (count){
		if (count == 0){ // la tabla se inicializa solo si está vacía

			User.create({
				id: '1',
				nombre: 'Anon',
				pass: '1234'
			});
			User.create({
				id: '2',
				nombre: 'Admin',
				pass: '1234'
			});
			User.create({
				id: '11',
				nombre: 'Seghis',
				pass: '1234'
			});
			Project.create({
				id: '1',
				pro_nombre: 'Labuk',
				pro_eslogan: 'Incubamos proyectos',
				pro_descripcion: 'Proyecto de soporte para esta página',
				pro_url: 'labuk',
				pro_portada: '1',
				pro_logo: 'project-1.png'
			});
			Piece.create({
				pie_nombre: 'Definición de proyecto',
				pie_url: 'definición-de-proyecto',
				pie_descripcion: 'Punto de partida donde se definen los objetivos y planifican las piezas del proyecto.',
				pie_prioridad: '0',
				UserId: 2,
				ProjectId: 1
			});
			Piece.create({
				pie_nombre: 'Foro general',
				pie_url: 'foro-general',
				pie_descripcion: 'Foro de discusión general del proyecto, para hablar de todos los temas relacionados con el mismo y establecer tareas compartidas o genéricas del proyecto.',
				pie_prioridad: '0',
				UserId: 2,
				ProjectId: 1
			});
			Piece.create({
				pie_nombre: 'Taller de creatividad',
				pie_url: 'taller-de-creatividad',
				pie_descripcion: 'Pieza donde se gestiona la creatividad del proyecto, creando tareas que posibiliten el surgimiento de nuevas ideas.',
				pie_prioridad: '0',
				UserId: 2,
				ProjectId: 1
			});
			Project.create({
				id: '2',
				pro_nombre: 'Blog Labuk',
				pro_eslogan: 'Incubamos proyectos',
				pro_descripcion: 'Proyecto del blog ofrecido en esta página',
				pro_url: 'blog-labuk',
				pro_portada: '1',
				pro_logo: 'project-2.png'
			});
			Project.create({
				id: '4',
				pro_nombre: 'Diseño Web Labuk',
				pro_eslogan: 'Incubamos proyectos',
				pro_descripcion: 'Proyecto del servicio de diseño web ofrecidos por esta página',
				pro_url: 'diseño-web-labuk',
				pro_portada: '1',
				pro_logo: 'project-2.png'
			});
			Project.create({
				id: '3',
				pro_nombre: 'ProyectoX',
				pro_eslogan: 'Innovación divergente',
				pro_descripcion: 'Proyecto X',
				pro_url: 'proyectox',
				pro_portada: '1',
				pro_logo: 'project-3.png'
			});
			Piece.create({
				pie_nombre: 'Definición de proyecto',
				pie_url: 'definición-de-proyecto',
				pie_descripcion: 'Punto de partida donde se definen los objetivos y planifican las piezas del proyecto.',
				pie_prioridad: '0',
				UserId: 11,
				ProjectId: 3
			});
			Piece.create({
				pie_nombre: 'Foro general',
				pie_url: 'foro-general',
				pie_descripcion: 'Foro de discusión general del proyecto, para hablar de todos los temas relacionados con el mismo y establecer tareas compartidas o genéricas del proyecto.',
				pie_prioridad: '0',
				UserId: 11,
				ProjectId: 3
			});
			Piece.create({
				pie_nombre: 'Taller de creatividad',
				pie_url: 'taller-de-creatividad',
				pie_descripcion: 'Pieza donde se gestiona la creatividad del proyecto, creando tareas que posibiliten el surgimiento de nuevas ideas.',
				pie_prioridad: '0',
				UserId: 11,
				ProjectId: 3
			});
			Member.create({
				mem_rol:'0',
				UserId:'2',
				ProjectId:'1'
			});
			Member.create({
				mem_rol:'0',
				UserId:'2',
				ProjectId:'2'
			});
			Member.create({
				mem_rol:'0',
				UserId:'11',
				ProjectId:'3'
			});
			Member.create({
				mem_rol:'0',
				UserId:'2',
				ProjectId:'4'
			});
			Contact.create({
				con_contact:'2',
				UserId: '11',
				con_block:'2',
				con_message: '2'
			});
			Contact.create({
				con_contact:'11',
				UserId: '2',
				con_block:'2',
				con_message: '2'
			})

			.then(function(){console.log('Base de datos inicializada')});
		};



	});
});
