const express = require('express');
const auth = require('../middleware/authorization');
const { 
    addToCart, 
    getCart, 
    removeFromCart, 
    createCheckoutSession, 
    editCart,
    forceClearCart,
    updateCartItem 
} = require('../controllers/cart.Controller');

const router = express.Router();

// Rutas de carrito
router.get('/', auth, getCart); // Obtener carrito
router.get('/get-cart', auth, getCart); // Alias para compatibilidad con frontend
router.post('/add', auth, addToCart); // Agregar al carrito
router.put('/update', auth, updateCartItem); // Actualizar cantidad 
router.put('/edit-cart', auth, editCart); // Editar carrito 
router.delete('/remove', auth, removeFromCart); // Eliminar producto

router.delete('/clear', auth, (req, res) => {
    
    res.json({ message: 'Carrito vaciado' });
});
router.post('/create-checkout-session', auth, createCheckoutSession); 
router.get('/create-checkout-session', auth, createCheckoutSession); 
router.post('/force-clear', auth, forceClearCart);



module.exports = router;