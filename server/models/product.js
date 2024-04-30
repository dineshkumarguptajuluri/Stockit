const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  purchasePrice:{
    type:Number,
    required:true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference the User model
    required: true,
  },
  stock: {
    type: Number,
    default: 0, // Initialize stock to 0
  },
});

module.exports = mongoose.model('Product', productSchema);
