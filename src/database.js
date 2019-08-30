const mongoose = require('mongoose');
//conexion a la base de datos
mongoose.connect('mongodb://localhost/notas-app', { //configuraciones necesarias para usar mongoose
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
    .then(db => console.log("Base de datos conectado"))
    .catch(err => console.error(err));