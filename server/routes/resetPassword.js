const express=require('express');
const router=express.Router();
const bcrypt=require('bcryptjs');
const User=require('../models/user');

const cookieParser = require('cookie-parser');
const sendOTPEmail=require('../controllers/Mail');
router.post('/', async (req, res) => {
    try {
        const { email} = req.body;
        console.log(email);
        const user = await User.findOne({email });

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        if(user.email!=email)
        return res.send("Incorrect email is entered");

        const otp = generateOTP();
        sendOTPEmail(email,otp)
        res.status(200).json({
            success: true,
            otp
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
});
function generateOTP() {
    console.log('otp generated');
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  module.exports=router;