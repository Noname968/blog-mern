const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const nodemailer = require("nodemailer");
const userauth = require("../middleware/userauth");
require("dotenv").config();
const Post = require("../models/Post");

// Check if a username is available
router.get("/check-username/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ name: username });
    if (user) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Check if an email is available
router.get("/check-email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email });
    if (user) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// create a new user: post
router.post("/", async (req, res) => {
  try {
    const { name, email, password, passwordverify } = req.body;

    // validation
    if (!name || !email || !password || !passwordverify) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all the fields" });
    }
    if (password.length < 8) {
      return res.status(400).json({
        errorMessage: "Entered password must be atleast 8 characters long",
      });
    }
    if (password !== passwordverify) {
      return res
        .status(400)
        .json({ errorMessage: "Entered passwords do not match" });
    }

    // check user exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errorMessage: "User already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const passwordhash = await bcrypt.hash(password, salt);

    // save a new user
    const newUser = new User({
      name,
      email,
      password: passwordhash,
    });
    const savedUser = await newUser.save();

    // log the user in
    const token = jwt.sign({ user: savedUser.id }, process.env.JWT_SECRET);

    // save the token to http-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
  }).send({ message: "Successfully registered user" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// login user
router.post("/login", async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body; // Added rememberMe field

    // validate
    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: "Please enter all the fields." });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password." });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!passwordCorrect) {
      return res.status(401).json({ errorMessage: "Wrong email or password." });
    }

    // sign the token
    const tokenDuration = rememberMe ? "7d" : "8hr"; // Set the token duration
    const token = jwt.sign({ user: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: tokenDuration,
    });

    // send the token in a HTTP-only cookie
    const cookieOptions = {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };

    if (rememberMe) {
      cookieOptions.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days for "remember me"
    }

    res
      .status(200)
      .cookie("token", token, cookieOptions)
      .send({ message: "Successfully logged in" });
  } catch (err) {
    res.status(500).send();
  }
});

// get user details
router.get("/user", userauth, async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId)
  let user;
  try {
    user = await User.findById(userId, "-password");
  } catch (err) {
    return new Error(err);
  }
  if (!user) {
    return res.status(404).json({ messsage: "User Not Found" });
  }
  return res.status(200).json({ user });
});

// user details by id
router.get('/postuser/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId, '-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/user/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { name, email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.password = password || user.password;
    await user.save();

    await Post.updateMany(
      { user: user._id },
      { $set: { author: user.name } }
    );

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// loggedin
router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);

    res.send(true);
  } catch (err) {
    res.json(false);
  }
});

// logout user
router.get("/logout", (req, res) => {
  // res.cookie("token", "", {
  //   httpOnly: true,
  //   expires: new Date(0),
  //   secure: true,
  //   sameSite: "none",
  // }).send("logged out successfully");
  res.clearCookie('token');
  res.json({ success: true });
});

// Follow a user
router.post('/follow/:userId', userauth, async (req, res) => {
  const currentUserId = req.user.id;
  const { userId } = req.params;

  try {
    // Update the current user's following list
    await User.findByIdAndUpdate(currentUserId, { $addToSet: { following: userId } });

    // Update the target user's followers list
    await User.findByIdAndUpdate(userId, { $addToSet: { followers: currentUserId } });

    res.status(200).json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unfollow a user
router.post('/unfollow/:userId', userauth, async (req, res) => {
  const currentUserId = req.user.id;
  const { userId } = req.params;

  try {
    // Remove the target user from the current user's following list
    await User.findByIdAndUpdate(currentUserId, { $pull: { following: userId } });

    // Remove the current user from the target user's followers list
    await User.findByIdAndUpdate(userId, { $pull: { followers: currentUserId } });

    res.status(200).json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// forgot password
router.post("/forgot/password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json("User not found");
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.USER,
      pass: process.env.SMTP_API_KEY,
    },
  });
  const resetLink = `http://localhost:3000/resetpass/${token}/${user._id}`;

  const mailOptions = {
    from: "mernblog@gmail.com",
    to: user.email,
    subject: "Password Reset",
    html: `
      <!doctype html>
      <html lang="en-US">
      <head>
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password Email Template.">
        <style type="text/css">
          a:hover { text-decoration: underline !important; }
        </style>
      </head>
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
          <tr>
              <td>
                  <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                      align="center" cellpadding="0" cellspacing="0">
                      <!-- Logo -->
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="text-align:center;">
                              <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                  <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                              </a>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td>
                              <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                  style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="padding:0 35px;">
                                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                              requested to reset your password</h1>
                                          <span
                                              style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                          <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                              We cannot  send you your old password. A unique link to reset your
                                              password has been generated for you. To reset your password, click the
                                              following link and follow the instructions.
                                          </p>
                                          <a href="${resetLink}"
                                          style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                          Password</a>
                                          <p style="margin-top: 30px;">
                                              If the button doesn't work, you can also
                                              <a href="${resetLink}">click here</a> to reset your password.
                                          </p>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                      <!-- Footer -->
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="text-align:center;">
                              <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.harshahv9680@gmail.com</strong></p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                  </table>
              </td>
          </tr>
        </table>
        <!--/100% body table-->
      </body>
      </html>
    `,
  };

  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error(error);
      return res.status(500).json("Error sending email for password reset.");
    } else {
      console.log("Email sent: " + info.response);
      return res.status(200).json("Check your email to reset password.");
    }
  });
});

// reset password
router.put("/reset/password/:token/:_id", async (req, res) => {
  try {
    const { token, _id } = req.params;
    if (!token || !_id) {
      return res.status(400).json("Invalid req");
    }
    const user = await User.findOne({ _id: _id });
    if (!user) {
      return res.status(400).json("user not found");
    }

    const { password, passwordverify } = req.body;
    if (password !== passwordverify) {
      return res
        .status(400)
        .json({ errorMessage: "Entered passwords do not match" });
    }
    const secpass = await bcrypt.hash(password, 10);
    user.password = secpass;
    await user.save();
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.USER,
        pass: process.env.SMTP_API_KEY,
      },
    });
    const mailOptions = {
      from: "mernblog@gmail.com",
      to: user.email,
      subject: "Password Reset Successful",
      html: `
      <!DOCTYPE html>
      <html lang="en-US">
      <head>
        <!-- Your email template's head content here -->
      </head>
      <body>
        <p>Your password has been successfully reset.</p>
        <p>You can now log in using your new password.</p>
        <p>If you didn't initiate this password reset, please contact us immediately.</p>
        <p>Thank you,</p>
        <p>Your MERN Blog Team</p>
      </body>
      </html>
    `,
    };

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error);
        return res.status(500).json("Error sending email.");
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json("Password updated successfully. Email has been sent.");
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json("An error occurred while updating the password.");
  }
});


module.exports = router;
