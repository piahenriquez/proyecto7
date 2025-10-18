const User = require('../models/User');
const Product = require('../models/Product');

// OBTENER FAVORITOS DEL USUARIO
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('favorites');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error('Error obteniendo favoritos:', error);
    res.status(500).json({ 
      message: 'Error al obtener favoritos', 
      error: error.message 
    });
  }
};

// AGREGAR PRODUCTO A FAVORITOS
exports.addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Verificar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si ya está en favoritos
    if (user.favorites.includes(productId)) {
      return res.status(400).json({ message: 'El producto ya está en favoritos' });
    }

    // Agregar a favoritos
    user.favorites.push(productId);
    await user.save();

    
    await user.populate('favorites');

    res.json({ 
      message: 'Producto agregado a favoritos', 
      favorites: user.favorites 
    });

  } catch (error) {
    console.error('Error agregando a favoritos:', error);
    res.status(500).json({ 
      message: 'Error al agregar a favoritos', 
      error: error.message 
    });
  }
};

// ELIMINAR PRODUCTO DE FAVORITOS
exports.removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si está en favoritos
    if (!user.favorites.includes(productId)) {
      return res.status(400).json({ message: 'El producto no está en favoritos' });
    }

    // Eliminar de favoritos
    user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
    await user.save();

    
    await user.populate('favorites');

    res.json({ 
      message: 'Producto eliminado de favoritos', 
      favorites: user.favorites 
    });

  } catch (error) {
    console.error('Error eliminando de favoritos:', error);
    res.status(500).json({ 
      message: 'Error al eliminar de favoritos', 
      error: error.message 
    });
  }
};

// VERIFICAR SI UN PRODUCTO ES FAVORITO
exports.isFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isFav = user.favorites.includes(productId);
    
    res.json({ isFavorite: isFav });

  } catch (error) {
    console.error('Error verificando favorito:', error);
    res.status(500).json({ 
      message: 'Error al verificar favorito', 
      error: error.message 
    });
  }
};