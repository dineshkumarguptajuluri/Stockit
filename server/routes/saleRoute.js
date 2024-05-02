const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product=require('../models/product');
const Sale=require('../models/sale');
const Purchase=require('../models/purchase');
const verifyToken=require('../controllers/verifyToken');

router.post('/',async(req,res)=>{
    //const username="karthik"
    const {  buyerName, products, grandTotal,date } = req.body;
  
  
    if (!products.length) {
        return res.status(400).json({ msg: 'No products to process.' });
    }
  
  
    try {
        const authHeader = req.headers['authorization'];
  
        const token = authHeader.split(' ')[1]; // Assuming Bearer token
        const decoded=verifyToken(token);
        console.log(decoded.userId);
        const username=decoded.username;
      const user = await User.findOne({username});
      products.forEach(product => {
        product.totalProfit = (product.salePrice - product.pricePerUnit) * product.quantity;
    });
    const grandProfit=products.reduce((acc, curr) => acc + curr.totalProfit, 0);
        const newSale = new Sale({
            user,
            date,
            buyerName,
            items:products,
            grandTotal,grandProfit
        });
        console.log(products);
        changeStock(products);
        console.log("successssssssssssssssssssssssss");
        
        await newSale.save();
        res.status(201).json(newSale);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  });
  async function changeStock(products){
    try {
        await Promise.all(products.map(item => {
            const { productId, quantity } = item;
            return Product.updateOne(
                { _id: productId },
                { $inc: { stock: -quantity } }
            );
        }));
        console.log('All stock updates successful.');
    } catch (error) {
        console.error('Failed to update stock:', error);
        throw error; // Re-throw the error if you want to handle it further up the call stack
    }
  }
  module.exports=router;