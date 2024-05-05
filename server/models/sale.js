const mongoose = require('mongoose');

const SaleItemSchema = new mongoose.Schema({
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
  ,
  totalProfit:{
    type:Number
  },
  salePrice:{
    type:Number,
    required:true
  },productName:{
    type:String,required:true
  }
});

const SaleSchema = new mongoose.Schema({
  date:{
    type:Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  buyerName: {
    type: String,
    required: true
  },
  items: [SaleItemSchema],
  grandTotal: {
    type: Number,
    required: true
  },
  grandProfit:{
    type:Number,
    required:true
  }
});

module.exports = mongoose.model('Sale', SaleSchema);
