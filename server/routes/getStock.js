const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product=require('../models/product');
const Sale=require('../models/sale');
const Purchase=require('../models/purchase');
const verifyToken=require('../controllers/verifyToken');

router.get('/', async (req, res) => {
    // Retrieve the user ID from the request or token (replace with your logic)
    //const username="karthik" // Assuming user ID is in 'id' property of user object or 'userId' property of token
    try {
        const authHeader = req.headers['authorization'];
  
    const token = authHeader.split(' ')[1]; // Assuming Bearer token
    const decoded=verifyToken(token);
    const username=decoded.username;
    const user = await User.findOne({username});
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      const stock = await Product.find({ user: user._id });
      
      // Find products for the authorized user
      stock.map((s)=>{
        console.log(s.name,s.stock);
      })
      res.json({ success: true, stock });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });
  router.post('/', async (req, res) => {
    //const username = "karthik";
    try {
        const authHeader = req.headers['authorization'];
  
        const token = authHeader.split(' ')[1]; // Assuming Bearer token
        const decoded=verifyToken(token);
        const { startDate } = req.body;
        const username=decoded.username;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
  
        const products = await Product.find({ user: user._id });
  
        // Map over products and call the calculateStockOnDateForProduct for each
        const stockPromises = products.map(product => 
            calculateStockOnDateForProduct(product._id, new Date(startDate))
        );
  
        // Wait for all promises to resolve
        const stock = await Promise.all(stockPromises);
  
        // Filter results to exclude products with zero quantity
       // const filteredStock = stockResults.filter(item => item.stockOnDate > 0);
  
        // Send successful response
        res.status(200).json({
            success: true,
            stock
        });
    } catch (error) {
        console.error("Error retrieving stock data:", error);
        res.status(500).json({ success: false, message: 'Failed to calculate stock' });
    }
  });
  async function calculateStockOnDateForProduct(productId, targetDate) {
    try {
        // Connect to MongoDB (update with your connection string)
       
  
        // Fetch the specific product
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found!");
        }
  
        // Fetch sales of this product after the target date
        const salesAfterDate = await Sale.aggregate([
            { $match: { date: { $lte: targetDate } } },
            { $unwind: '$items' },
            { $match: { 'items.productId': product._id } },
            {
                $group: {
                    _id: '$items.productId',
                    totalQuantitySold: { $sum: '$items.quantity' }
                }
            }
        ]);
  
        // Fetch purchases of this product after the target date
        const purchasesAfterDate = await Purchase.aggregate([
            { $match: { date: { $lte: targetDate } } },
            { $unwind: '$items' },
            { $match: { 'items.productId': product._id } },
            {
                $group: {
                    _id: '$items.productId',
                    totalQuantityPurchased: { $sum: '$items.quantity' }
                }
            }
        ]);
  
        // Calculate the total sold and purchased quantities
        const totalQuantitySold = salesAfterDate[0] ? salesAfterDate[0].totalQuantitySold : 0;
        const totalQuantityPurchased = purchasesAfterDate[0] ? purchasesAfterDate[0].totalQuantityPurchased : 0;
  
        // Calculate stock on target date
        const calculatedStock = totalQuantityPurchased - totalQuantitySold;
  
        return {
            productId: product._id,
            name: product.name,
            stock: calculatedStock
        };
    } catch (error) {
        console.error("Failed to calculate stock on date:", error);
        throw error;
    }}
    module.exports=router;