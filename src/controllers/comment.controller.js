const Comment = require('../models/Comment');
const Product = require('../models/Product');
const User = require('../models/User');

// CREAR NUEVO COMENTARIO
exports.createComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { comment, rating = 5 } = req.body;
    const userId = req.user.id;

    // Validar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Obtener información del usuario
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Validar datos del comentario
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: 'El comentario no puede estar vacío' });
    }

    if (comment.length > 500) {
      return res.status(400).json({ message: 'El comentario no puede tener más de 500 caracteres' });
    }

    // Crear el comentario
    const newComment = await Comment.create({
      productId,
      userId,
      userName: user.username,
      rating,
      comment: comment.trim()
    });

    
    await newComment.populate('userId', 'username');

    res.status(201).json({
      message: 'Comentario agregado correctamente',
      comment: newComment
    });

  } catch (error) {
    console.error('Error creando comentario:', error);
    res.status(500).json({
      message: 'Error al crear el comentario',
      error: error.message
    });
  }
};

// OBTENER COMENTARIOS DE UN PRODUCTO
exports.getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validar que el producto existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Obtener comentarios ordenados por fecha (más recientes primero)
    const comments = await Comment.find({ productId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 }); 

    res.json({
      message: 'Comentarios obtenidos correctamente',
      comments,
      total: comments.length
    });

  } catch (error) {
    console.error('Error obteniendo comentarios:', error);
    res.status(500).json({
      message: 'Error al obtener comentarios',
      error: error.message
    });
  }
};

// ELIMINAR COMENTARIO 
exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Verificar que el usuario es el dueño del comentario
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: 'Comentario eliminado correctamente' });

  } catch (error) {
    console.error('Error eliminando comentario:', error);
    res.status(500).json({
      message: 'Error al eliminar comentario',
      error: error.message
    });
  }
};