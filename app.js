// Importar paquetes con middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

// Importar enrutadores 
var routes = require('./routes/index');

// Crear aplicación
var app = express();

// view engine setup - Instalar generador de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Instalar middlewares
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session());
app.use(partials());
app.use(methodOverride('_method'));

// Helpers dinamicos:
app.use(function(req, res, next){

   //guardar path en session.redir para despues de login
   if (!req.path.match(/\/login|\/logout/)) {
	req.session.redir = req.path;
   }

   // Hacer visible req.session en las vistas
   res.locals.session = req.session;
   next();

});

// Auto logout: al estar más de 2 minutos sin conectar por http
app.use(function(req, res, next) {
    req.session.autologout = req.session.autologout || 0;
    if (req.session.user && (Date.now() - req.session.autologout) > 120000) {
	console.log('Logout');
	var err = new Error('Mas de 2 minutos sin actividad. La sessión se va a desconectar.');
	//callback(new Error('Mas de 2 minutos sin actividad. La sessión se va a desconectar.'));
	req.session.errors = [{"mess_logout": 'Mas de 2 minutos sin actividad. Vuelve a autentificarte.'}];
	req.session.redir = "/login";
	//res.render("/login")
	res.redirect("/logout");
	next();
	//next(err);
    } else {
	req.session.autologout = Date.now();
	next();
    }
    
});

// Instalar enrutadores
app.use('/', routes);

// catch 404 and forward to error handler - Resto de rutas: genera error 404 de HTTP
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler: will print stacktrace - Gestión de errores durante el desarrollo
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
	    errors: []
        });
    });
}

// production error handler: no stacktraces leaked to user - Gestión de errores de producción
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
	errors: []
    });
});

// Exportar app para comando de arranque
module.exports = app;
