const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken');
const secretKey="Dinesh Kumar Juluri";

const app = express();
const port =4000;
app.use(cors({
  origin:[ 'http://localhost:3000','https://stockit-98k3.vercel.app'], // Replace with your React app's origin
  credentials: true // Allow cookies for authenticated requests (optional)
}));
app.use(express.json());

// Connect to MongoDB (replace with your connection string)
mongoose.connect('mongodb+srv://juluridineshkumar:mVTEA0IEtOgAjZVu@cluster0.qtn8kcb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
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
const getPurchases=require('./routes/getPurchases');
const getSales=require('./routes/getSales');
const getStock=require('./routes/getStock');
const saleRoute=require('./routes/saleRoute');
const purchaseRoute=require('./routes/purchaseRoute');
const resetPassword=require('./routes/resetPassword');
const verifyToken=require('./controllers/verifyToken');


// Body parser middleware
app.use(bodyParser.json());
app.use('/getPurchases',getPurchases);
app.use('/getSales',getSales);
app.use('/getStock',getStock);
app.use('/sale',saleRoute);
app.use('/purchase',purchaseRoute);
app.use('/resetPassword',resetPassword);


// Login route (POST)
app.post('/signup',async(req,res)=>{
  const{username,password,email}=req.body;
  console.log("hiii");
  try {
    // Find user by username
    const existingUser = await User.findOne({ username:username });
    if (existingUser) {
      return res.status(400).send({ success:false});
    }

    // Compare password hashes securely
    const newUser = new User({ username, password,email });
    await newUser.save();

    // Login successful
    res.status(200).send({ success: true }); // Login successful
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false }); // Generic error for security
  }
});
app.post('/login', async (req, res) => {
  const { username, password } = req.body;



  try {
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).send({ success: false }); // Login failed
    }
    const token = jwt.sign({username:username}, secretKey, { algorithm: 'HS256',expiresIn:'3h'});
    console.log(token);

    // Compare password hashes securely
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ success: false }); // Login failed
    }

    // Login successful
    res.status(200).send({ success: true,token }); // Login successful
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false }); // Generic error for security
  }
});
app.post('/addproduct',async(req,res)=>{

  const{username,name,price,description}=req.body;
  try{
    console.log("hiii");
    const authHeader = req.headers['authorization'];
  
    const token = authHeader.split(' ')[1]; // Assuming Bearer token
    console.log(token);
    const decoded=verifyToken(token);
    console.log
 
   const username=decoded.username;
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

});
app.post('/changePassword',async(req,res)=>{
  const{email,newPassword}=req.body;
  try{
    const user=await User.findOne({email});
    user.password = newPassword;
    await user.save();
    res.status(200).send({ success: true });
  }
  catch(error){
    res.status(200).send({ success: false });
  }
})

app.listen(port, () => console.log(`Server listening on port ${port}`));