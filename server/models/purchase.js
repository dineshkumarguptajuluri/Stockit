const mongoose = require('mongoose');

const PurchaseItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  pricePerUnit: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  }
});

const PurchaseSchema = new mongoose.Schema({
    date:{
        type:Date
      },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  items: [PurchaseItemSchema],
  grandTotal: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
