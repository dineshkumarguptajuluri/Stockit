const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product=require('../models/product');
const Sale=require('../models/sale');
const Purchase=require('../models/purchase');
const verifyToken=require('../controllers/verifyToken');

router.post('/', async (req,res)=>{
    //const username="karthik"
    const {  sellerName, products, grandTotal,date} = req.body;
  
    if (!products.length) {
        return res.status(400).json({ msg: 'No products to process.' });
    }
  
  
    try {
        const authHeader = req.headers['authorization'];
  
        const token = authHeader.split(' ')[1]; // Assuming Bearer token
        const decoded=verifyToken(token);
        const username=decoded.username;
        const user = await User.findOne({username});
        const newPurchase = new Purchase({
            user,
            sellerName,
            items:products,
            grandTotal,date
        });
        console.log(products);
        updateStock(products);
        console.log("success");
        
        await newPurchase.save();
        res.status(201).json(newPurchase);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
  
  })
  async function updateStock(products){
    try {
        await Promise.all(products.map(item => {
            const { productId, quantity,purchasePrice } = item;
            return Product.updateOne(
                { _id: productId },
                { $inc: { stock: quantity } },
                {$set: {purchasePrice:purchasePrice}}
            );
        }));
        console.log('All stock incremented successful.');
    } catch (error) {
        console.error('Failed to update stock:', error);
        throw error; // Re-throw the error if you want to handle it further up the call stack
  
    }
  }
  module.exports=router;