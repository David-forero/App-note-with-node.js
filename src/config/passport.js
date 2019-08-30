const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../model/Usuarios'); 

passport.use(new LocalStrategy({
  usernameField: 'correo'
}, async (correo, password, done) => {//validamos si el usuario existe
  const user = await User.findOne({correo: correo});
  if (!user) {
    return done(null, false, { message: '*El usuario no existe.' });
  } else {//y si existe, validamos la clave!
    const match = await user.matchPassword(password);
    if(match) {
      return done(null, user);
    } else {
      return done(null, false, { message: '*Clave incorrecto.' });
    }
  }

}));

passport.serializeUser((user, done) => { //lo identificamos para que pueda ingresar a las paginas con session
  done(null, user.id);
});

passport.deserializeUser((id, done) => {//lo guardaremos como session
  User.findById(id, (err, user) => {
    done(err, user);
  });
});