const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    titulo:{type: String, required: true},
    descripcion:{type: String, required: true},
    date: {type: Date, default: Date.now}, //es para guardar la fecha actual en la que se crearon la nota
    usuario: {type: String}
});

module.exports = mongoose.model('Notas', NoteSchema); //para decirle a mongodb como luciran los datos
//y decirle como se llamara  la coleccion 'Notas'