const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongoose').Types;
const getMiddleware = require("../middleware/GetMiddleware");


// Access JWT_SECRET from environment variables
const secret_key = process.env.JWT_SECRET;
console.log("secret_key==>", secret_key)


//--------------------------Route 1------------------------------------------------------
//Create a User using: POST "/api/createUser"... Register
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 2 }),
    body("email", "Enter a email name").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are errors, returns bad request and the errors
    // res.send('Hello Amishaaaa');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      // Check wheather the user with the same exists already
      let user = await User.findOne({
        email: req.body.email,
      });
      console.log("user==>", user);
      if (user) {
        return res.status(400).json({
          error: "Sorry, user with this email already exist",
        });
      }

      //Creating a secured password from req.body.password
      const salt = await bcrypt.genSalt(10);
      let securedPassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securedPassword,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, secret_key);
      console.log("jwt data console==>", authToken);
      res.status(200).json({ authToken });
    } catch (error) {
      console.log("My error==>", error);
      console.error(error.message);
      res.status(500).send("Internal server error");
    }

    // .then(user => res.json(user)).catch(err => {
    //     console.log(err);
    //     console.log("catch block me gya code")
    //     res.json({
    //         error: 'Please enter unique value for email',
    //         message :err.message
    //     })
    // })

    // res.send(req.body)
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    // res.send("Hello");
  }
);

//--------------------------Route 2------------------------------------------------------
//Authenticate a user : post "localhost:5000/api/auth/createUser"   LOGIN API
router.post(
  "/loginUser",
  getMiddleware,
  [
    body("email", "Enter a email name").isEmail(),
    body("password", "Password can not be blank").exists(),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      //user mese email find karenge and usse match karwaenge(campare karenge)
      let user = await User.findOne({
        email: email
      })

      //agar email match nahi hua to..
      if (!user) {
        return res.status(400).json({
          error: "Please try to login with correct credentials"
        })
      }

      //Bcrypt ki help se passowrd ko comapre karenge, jo passwaord dala jaya hai usse user ke password se compare karenge
      const passwordCompare = await bcrypt.compare(password, user.password);

      if (!passwordCompare) {
        return res.status(400).json({
          error: "Please try to login with correct credentials"
        })
      }

      //jab email and password dono sahi hoga tab response me ye chala jaega
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, secret_key);
      res.status(200).json({ authToken });

    } catch (error) {
      console.log("My error==>", error);
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  })


//--------------------------Route 3 ------------------------------------------------------
//This Route 3 gives us details of logged in user by using Post method, Login required


//In this API, I have to extract user id from autToken, so that we  can only access perticular routes according to user id--
router.post(
  "/getUser", fetchuser, async (req, res) => {

    try {
      const userId = req.user.id;
      //This line means , once we get userId then we can select all the fields except the password
      const user = await User.findById(userId).select("-password");
      res.send(user)
    } catch (error) {
      console.log("My error==>", error);
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  })


// ------------------Route 4 : Forget -------------
// route : localhost:5000/api/auth/forget-password

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'er.amishamotwani@gmail.com',
    pass: 'mfxp kryu xuxf zavm',
  },
});

router.post('/forget-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user._id }, secret_key, { expiresIn: '1h' });

    // Save the reset token and its expiration time in the user model
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send email with the reset link using nodemailer for SMTP
    const resetLink = `http://localhost:5000/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: 'er.amishamotwani@gmail.com', // sender address
      to: user.email, // recipient address
      subject: 'Password Reset',
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//--------------------------Route 5 : Reset ----------------------------------------------
// Route: localhost:5000/api/auth/reset-password/${token}
router.post('/reset-password/:token', async (req, res) => {
  const resetToken = req.params.token;
  const { newPassword } = req.body;

  try {
    // Find the user by resetToken and check if it's still valid
    const user = await User.findOne({
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and reset token information
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
