const express = require('express');
const auth = require('../middleware/authorization');
const {
  createComment,
  getProductComments,
  deleteComment
} = require('../controllers/comment.controller');

const router = express.Router();

// Rutas de comentarios 
router.post('/products/:productId/comments', auth, createComment);
router.get('/products/:productId/comments', getProductComments);
router.delete('/comments/:commentId', auth, deleteComment);

module.exports = router;