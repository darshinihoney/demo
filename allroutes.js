const express = require("express");
const {usersModel} = require("../backend/schemas");
let allroutes = express.Router();
const multer = require("multer");
const upload = multer();
const nodemailer = require('nodemailer'); 

allroutes.get('/',(req,res) => {
    console.log(" reached root");
    res.send("Welcome to real estate market place back end service");
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'darshinibachu@gmail.com',
      pass: 'gest ovns ejvb deni',
    }
  });
  

const otpStorage = new Map();


allroutes.post('/signUp',upload.none(),async (req,res) =>{
    try{ 
        console.log(req.body);
        let newuser = new usersModel(req.body)
        let userFromDB = await newuser.save();
        console.log(userFromDB);
        res.send(userFromDB);
    }
    catch(err){
        console.log(" error while adding user. check if it is duplicate");
        console.log(err);
        res.status(500).send(err)
    }
});


allroutes.post('/login',upload.none(),async (req,res) =>{
    
    try{ 
        console.log(req.body);
        let user = await usersModel.findOne({ username: req.body.name });
        console.log(user)
        // let response = await usersModel.findOne({name:req.body.name,password:req.body.password});
        if(user){
            if (user.password === req.body.password) {
            res.send(user); // Send user data if login successful
            console.log("Login successful");
            } else {
            res.status(401).send("Invalid credentials"); // Send error response for invalid credentials
            }
        }
        else{
            res.status(401).send("Invalid credentials");
        }       
    }
    catch(err){
        console.log(err);
        res.status(500).send(err)
    }
});

  allroutes.post('/send-otp',upload.none(), async (req, res) => {
    const { email } = req.body;
   console.log(email);
    if (!email) {
      return res.status(400).json({ 'error': 'Email address is required' });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStorage.set(email, otp); 
    console.log('OTP stored in otpStorage:', otpStorage.get(email));
    const mailOptions = {
      from: 'darshinibachu@gmail.com',
      to: email,
      subject: 'Your OTP',
      text: `Your OTP is: ${otp}`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  allroutes.post('/verify-otp', upload.none(), (req, res) => {
    const { email, userEnteredOtp } = req.body;
    console.log('Received email:', email);
    console.log('Received OTP:', userEnteredOtp);
  
    if (!email || !userEnteredOtp) {
      return res.status(400).json({ error: 'Email and userEnteredOtp are required' });
    }
  
    const storedOtp = otpStorage.get(email);
    console.log('Stored OTP:', storedOtp);
    console.log(storedOtp == userEnteredOtp);
  
    if (storedOtp && storedOtp.toString().trim() === userEnteredOtp.toString().trim()){
      return res.status(200).json({ success: true, message: 'OTP verified successfully..!' });
    } else {
      return res.status(200).json({ success: false, error: 'Invalid OTP' });
    }
  });


module.exports = allroutes;