const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5,
    default: 5
  },
  comment: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;