const mongoose = require('mongoose');
const { Schema } = mongoose;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  usuario: { type: String, required: true },
  correo: { type: String, required: true },
  clave: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

UserSchema.methods.encryptPassword = async (clave) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(clave, salt);
  return hash;
};

UserSchema.methods.matchPassword = async function (clave) {
  return await bcrypt.compare(clave, this.clave);
};

module.exports = mongoose.model('usuarios', UserSchema);