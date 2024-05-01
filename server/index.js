const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing

const app = express();
const port =4000;
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your React app's origin
  credentials: true // Allow cookies for authenticated requests (optional)
}));

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb+srv://juluridineshkumar:ukNlZVpR60SlThNI@cluster0.qtn8kcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Define the User schema


const User = require('./models/user');
const Product=require('./models/product');
const Sale=require('./models/sale');
const Purchase=require('./models/purchase');

// Body parser middleware
app.use(bodyParser.json());

// Login route (POST)
app.post('/signup',async(req,res)=>{
  const{username,password}=req.body;
  console.log("hiii");
  try {
    // Find user by username
    const existingUser = await User.findOne({ username:username });
    if (existingUser) {
      return res.status(400).send({ success:false});
    }

    // Compare password hashes securely
    const newUser = new User({ username, password });
    await newUser.save();

    // Login successful
    res.status(200).send({ success: true }); // Login successful
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false }); // Generic error for security
  }
})
app.post('/login', async (req, res) => {
  const { username, password } = req.body;



  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ success: false }); // Login failed
    }

    // Compare password hashes securely
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ success: false }); // Login failed
    }

    // Login successful
    res.status(200).send({ success: true }); // Login successful
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false }); // Generic error for security
  }
});
app.post('/addproduct',async(req,res)=>{

  const{username,name,price,description}=req.body;
  try{
    console.log("addddd productttt");
    const user = await User.findOne({username}); // Fetch the user object
  
const newProduct = new Product({
  name,
  price,
  purchasePrice:price,
  description,
  user: user._id, // Associate with the fetched user
});
await newProduct.save();
res.status(200).send({ success: true });
  }
  catch(error){
    res.status(200).send({ success: false });
  }

})
app.get('/getProducts', async (req, res) => {
  // Retrieve the user ID from the request or token (replace with your logic)
  const username="karthik" // Assuming user ID is in 'id' property of user object or 'userId' property of token
  try {
    const user = await User.findOne({username});
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const products = await Product.find({ user: user._id }); // Find products for the authorized user
    console.log(products)
    res.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});
app.get('/getSales',async(req,res)=>{
  const username='karthik';
  try{
    const user=await User.findOne({username});
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
app.post('/getSales',async(req,res)=>{
  const {startDate,endDate}=req.body;
  try{
    const user=await User.findOne({username});
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
app.post('/sale',async(req,res)=>{
  const username="karthik"
  const {  buyerName, products, grandTotal,date } = req.body;

  if (!products.length) {
      return res.status(400).json({ msg: 'No products to process.' });
  }


  try {
    const user = await User.findOne({username});
    products.forEach(product => {
      product.totalProfit = (product.salePrice - product.pricePerUnit) * product.quantity;
  });
  const grandProfit=products.reduce((acc, curr) => acc + curr.totalProfit, 0);
      const newSale = new Sale({
          user,
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
app.post('/purchase', async (req,res)=>{
  const username="karthik"
  const {  sellerName, products, grandTotal,date} = req.body;

  if (!products.length) {
      return res.status(400).json({ msg: 'No products to process.' });
  }


  try {
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
app.listen(port, () => console.log(`Server listening on port ${port}`));