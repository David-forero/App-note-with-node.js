const helpers = {}; //comprobaremos si el usuario inicio session

helpers.isAuthenticated = (req, res, next) =>{
    if (req.isAuthenticated()) {//si se logueo que continue
        return next();
    }//si no esta registrado, lo mandara al formulario login
    res.redirect('/users/ingresar');
}

module.exports = helpers;