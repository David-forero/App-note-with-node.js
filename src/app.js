const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override'); //sirve para enviar otro tipos de metodos aparte de get y post
const session = require('express-session'); //para guardar los datos del usuario
const flash = require('connect-flash'); //crea variables globales
const passport = require('passport'); //para validar al ingresar 

//initialtion
const app = express();
require('./database');  //iniciar base de datos
require('./config/passport');

//settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, './views'));
app.engine('.hbs', exphbs({//configurar el motor de plantilla
    defaultLayout: 'main', //nuestro 'include' para reutilizar plantillas
    layoutsDir: path.join(app.get('views'), 'layouts'), //su ubicacion en donde estará el archivo main
    partialsDir: path.join(app.get('views'), 'partials'), //reutilizar unas plantillas
    extname: '.hbs'
}));
app.set('view engine', '.hbs'); //y finalmente lo uso

//middlewares
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({//para las sessiones guardadas
    secret: 'bakura',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global variable
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.usuario = req.user || null; //passport me dara los datos del usuario cuando entra y si no esta, su valor sera nulo
    next();
});

//routes
app.use(require('./routes/index'));
app.use(require('./routes/notas')); //para que los usuarios creen sus notas
app.use(require('./routes/usuario')); //para programar los logins

//static files
app.use(express.static(path.join(__dirname, 'public')));

//servidor
app.listen(app.get('port'), () => {
    console.log('Servidor trabajando en el puerto', app.get('port'));
});