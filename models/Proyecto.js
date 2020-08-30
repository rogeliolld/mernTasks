const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var ProyectoSchema = new mongoose.Schema({
    nombre:{
        type:String,
        required:true,
        trim: true,
    },
    creador:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    creado:{
        type: Date,
        default: Date.now(),
    },
    
});

//Export the model
module.exports = mongoose.model('Proyecto', ProyectoSchema);