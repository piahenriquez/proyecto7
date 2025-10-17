const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    //nombre
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    //descripcion
    description: {
        type: String,
        default: ""
    },
    //precio
    price: {
        type: Number,
        required: true,
        min: 0
    },

    //categoria
    category: {
        type: String,
        required: true,
        enum: ['macetero-pequeño', 'macetero-mediano', 'set-regalo', 'personalizado']
    },

    //stock
    stock: {
        type: Number,
        required: true,
        default: 1,
    },
    //imagen
    image: {
        type: String,
        default:''
    },
    // Stripe producto id 
    idProd: {
        type: String,
        default: ''
    },
    // Stripe precio id 
    priceID: {
        type: String,
        default: ''
    },
    //  Stripe precio momento
    currency: {
        type: String,
        default: 'clp'
    },
    //destacado
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
// Exportar el modelo

module.exports = Product;

