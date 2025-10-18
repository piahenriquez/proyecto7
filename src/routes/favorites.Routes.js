const express = require('express');
const auth = require('../middleware/authorization');
const {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite
} = require('../controllers/favorites.controller');

const router = express.Router();

// Rutas de favoritos
router.get('/', auth, getFavorites); // Obtener todos los favoritos
router.post('/add', auth, addToFavorites); // Agregar a favoritos
router.delete('/remove', auth, removeFromFavorites); // Eliminar de favoritos
router.get('/check/:productId', auth, isFavorite); // Verificar si es favorito

module.exports = router;