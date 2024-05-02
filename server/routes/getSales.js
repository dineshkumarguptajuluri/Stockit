const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product=require('../models/product');
const Sale=require('../models/sale');
const Purchase=require('../models/purchase');
const verifyToken=require('../controllers/verifyToken');

router.get('/',async(req,res)=>{
    //const username='karthik';

    try{
      const authHeader = req.headers['authorization'];
  
    const token = authHeader.split(' ')[1]; // Assuming Bearer token
    const decoded=verifyToken(token);
    const username=decoded.username;
    const user = await User.findOne({username});
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const sales=await Sale.find({user:user._id});
      console.log(sales);
      res.json({success:true,sales});
    }
    catch(error){
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  })
  router.post('/',async(req,res)=>{
    const {startDate,endDate}=req.body;
    //const username='karthik';
    try{
      const authHeader = req.headers['authorization'];
  
      const token = authHeader.split(' ')[1]; // Assuming Bearer token
      const decoded=verifyToken(token);
      const username=decoded.username;
      const user = await User.findOne({username});
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      const sales = await Sale.find({
        user: user._id,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      });
      console.log(sales);
      res.json({success:true,sales});
    }
    catch(error){
      console.error('Error fetching products:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  })
  module.exports=router;