const Tarea = require ('../models/Tarea');
const Proyecto = require ('../models/Proyecto');
const { validationResult} = require('express-validator');

//crear un nueva tarea

exports.crearTarea  = async (req, res)=>{
    //revisar si hy errores
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({errores: errores.array()});
    }

    

    try {
        //extraer del proyecto y comprobar si existe
        const {proyecto} = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //revisar el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json(tarea);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//obtener Tareas
exports.obtenerTareas =  async (req, res) =>{

    try {

        //extraer del proyecto y comprobar si existe
        const {proyecto} = req.query;

        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto){
            return res.status(404).json({msg:'Proyecto no encontrado'});
        }

        //revisar el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }
        
        //obtener las tareas por proyecto
        const tareas = await Tarea.find({proyecto}).sort({creado:-1});
        res.json({tareas});
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }

}

//Actualizar Tareas

exports.actualizarTareas = async (req, res)=>{
    try {
        
        //extraer del proyecto y comprobar si existe
        const {proyecto, nombre, estado} = req.body;

        const existeProyecto = await Proyecto.findById(proyecto);
      
        //si la tarea existe o no 

        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(401).json({msg: 'No existe esa tarea'});
        }

        //revisar el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Creacion de un objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({_id : req.params.id }, nuevaTarea, {new: true});
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTareas = async (req, res) =>{
    try {
        //extraer del proyecto y comprobar si existe
        const {proyecto} = req.query;
      
        //si la tarea existe o no 

        let tarea = await Tarea.findById(req.params.id);
        if(!tarea){
            return res.status(401).json({msg: 'No existe esa tarea'});
        }
        //extraer el proyecto
        const existeProyecto = await Proyecto.findById(proyecto);

        //revisar el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No Autorizado'});
        }

        //Eliminar
        await Tarea.findOneAndRemove({_id: req.params.id});
        res.json({msg: 'Tarea Eliminada'})

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
        
    }
}