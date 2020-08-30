const express = require ('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

//Crear tarea
// api/tareas

router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El Proyecto es obligatorio').not().isEmpty(),

    ],
    tareaController.crearTarea
);

//obtener tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
)

//Actualizar tarea
router.put('/:id',
    auth,
    tareaController.actualizarTareas
)

//Eliminar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTareas
)
module.exports = router