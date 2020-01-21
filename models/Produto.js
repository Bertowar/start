const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const Produto = new Schema({
    cod_produto: {
        type: String,
        required: true
    },
    desc_produto: {
        type: String,
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: "categorias",
        require: true
    }, 
    materia : {
        type: Schema.Types.ObjectId,
        ref: "mateiras",
        require: true
    }, 
    qtd_mp: {
        type: String,
        required: true
    },
    peso_produto: {
        type: String,
        require: true
    }, 
    add_produto: {
        type: String,
        required: true
    },
   etapa1: {
        type: String,
        required: true
    }, 
    etapa2: {
        type: String,
        required: false
    },
    etapa3: {
        type: String,
        required: false
    },
    etapa4: {
        type: String,
        required: false
    },
    etapa5: {
        type: String,
        required: false
    },
    etapa6: {
        type: String,
        required: false
    },
        tempo1: {
        type: String,
        required: true
    },  
    tempo2: {
        type: String,
        required: false,
    },
    tempo3: {
        type: String,
        required: false
    },  
    tempo4: {
        type: String,
        required: false
    },  
    tempo5: {
        type: String,
        required: false
    },  
    tempo6: {
        type: String,
        required: false,
    },   
    date: {
        type: Date,
        default: Date.now()
    }
   
})

mongoose.model("produtos", Produto)