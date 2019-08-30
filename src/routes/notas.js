const express = require('express');
const router = express.Router();
const notas = require('../model/Notas');// con esto lo requiero para guardar, editar, eliminar datos, etc
const { isAuthenticated } = require('../helper/auth'); //me permitira asegurarme las rutas por session

router.get("/agregar/new-notes", isAuthenticated, (req, res) => {
    res.render("notas/new-notes");
});

router.post("/agregar/new-notes", isAuthenticated, async (req, res) => {
    const { titulo, descripcion } = req.body; //obtengo los datos por el name y los valido
    const error = [];
    //validar los inputs
    if(!titulo || !descripcion){//si no hay un campo vacio...
        error.push({text: "*Porfavor no dejar campos vacios"});
    }
    if (error.length > 0) {//si hay algun error
        res.render("notas/new-notes", {
            error,
            titulo,
            descripcion
        });
    }else{
       const guardar = new notas({titulo, descripcion}); //obtenemos los datos
       guardar.usuario = req.user.id;
       await guardar.save();
       res.redirect("/notas");
    }
    
});

//mostrar los datos por pantalla

router.get("/notas", isAuthenticated, async (req, res) => {
    const rows = await notas.find({usuario: req.user.id}).sort({date: 'desc'}); //lo obtengo y que se ordene por fecha de menor a mayor
    res.render("notas/all-notes", {rows});
});

//Editar los datos

router.get("/notas/editar/:id", isAuthenticated, async (req, res) => {
    const editar = await notas.findById(req.params.id); //obtengo los datos de la database
    res.render('notas/editar-nota', {editar});
});

router.put("/notas/editar/:id", isAuthenticated, async (req, res) => {
    const { titulo, descripcion} = req.body;
    await notas.findByIdAndUpdate(req.params.id, {titulo, descripcion}); //le digo que quiero actualizar
    res.redirect('/notas');
});

//Eliminar los datos

router.delete("/notas/borrar/:id", isAuthenticated, async (req, res) => {
    await notas.findByIdAndDelete(req.params.id);
    res.redirect('/notas');
});

module.exports = router;