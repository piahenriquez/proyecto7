const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            },
            priceID: {
                type: String
            },
            name: {
                type: String
            },
            price: {
                type: Number
            },
            img: {
                type: String
            },
            image: {
                type: String
            },
            slug: {
                type: String
            }
        }
    ]
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;