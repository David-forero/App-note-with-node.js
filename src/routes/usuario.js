const express = require('express');
const router = express.Router();
const usuarios = require('../model/Usuarios'); //obtengo el schema de usuarios
const passport = require('passport'); //obtengo las validaciones

//Ingresar los usuarios

router.get("/users/ingresar", (req, res) => {
    res.render('users/ingresar');
});

router.post("/users/ingresar", passport.authenticate('local', {
    successRedirect: '/notas',
    failureRedirect: '/users/ingresar',
    failureFlash: true
}));

//registros de usuarios

router.get("/users/registrar", (req, res) => {
    res.render('users/registrar');
});

router.post("/users/registrar", async (req, res) => {
    const {usuario, correo, clave, clave_confirm} = req.body;
    const error = [];
    if (clave.length <= 0 || usuario.length <= 0 || correo.length <= 0 || clave_confirm.length <= 0) {
        error.push({text: "*No dejar campos vacios"});
    }
    if (clave != clave_confirm) {
        error.push({text: "*Las claves no coiciden"});
    }
    if (clave.length < 4) {
        error.push({text: "*La clave es muy debil"});
    }
    if (error.length > 0) {
        res.render('users/registrar', {error, usuario, correo, clave, clave_confirm});  //para que no vuelvan a insertar los campos
    }else{
        const correoUsuario = await usuarios.findOne({correo: correo}); //para buscar si existe ese email
        if (correoUsuario) {
            error.push({text: "*El correo ya esta en uso"});
            res.render('users/registrar', {error, usuario, correo, clave, clave_confirm});
        }

        const guardar = new usuarios({usuario, correo, clave});
        guardar.clave = await guardar.encryptPassword(clave); //para guardar la clave cryptada
        await guardar.save();
        res.redirect('/users/ingresar');
    }
});

router.get('/notas/cerrar', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;