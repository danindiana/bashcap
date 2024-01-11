const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Hello, world!');
});

// Secret key for JWT
const SECRET_KEY = 'your-secret-key';

// An example user database stored in memory
let users = [];

app.post('/register', (req, res) => {
  // Hash the password
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  // Generate a random token
  const token = crypto.randomBytes(20).toString('hex');

  // Create a new user
  const user = {
    username: req.body.username,
    password: hashedPassword,
    email: req.body.email,
    isVerified: false,
    verifyEmailToken: token,
    resetPasswordToken: null,
    resetPasswordExpires: null,
  };

  // Add the user to the database
  users.push(user);

  // Send the token to the user's email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password',
    },
  });

  const mailOptions = {
    to: user.email,
    from: 'your-email@gmail.com',
    subject: 'Email Verification',
    text: 'Please click the following link to verify your email:\n\n' +
          'http://' + req.headers.host + '/verify-email/' + token + '\n\n' +
          'If you did not request this, please ignore this email.\n',
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) return res.sendStatus(500); // Internal Server Error

    res.sendStatus(201); // Created
  });
});

app.get('/verify-email/:token', (req, res) => {
  // Find the user
  const user = users.find(u => u.verifyEmailToken === req.params.token);

  if (!user) {
    return res.sendStatus(400); // Bad Request
  }

  // Verify the user's email
  user.isVerified = true;
  user.verifyEmailToken = null;

  res.sendStatus(200);
});

app.post('/login', (req, res) => {
  // Find the user
  const user = users.find(u => u.username === req.body.username);

  // Check if the user exists and the password is correct
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    // Create a token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
  } else {
    res.sendStatus(401); // Unauthorized
  }
});

app.post('/forgot', (req, res) => {
  // Generate a random token
  const token = crypto.randomBytes(20).toString('hex');

  // Find the user
  const user = users.find(u => u.username === req.body.username);

  if (!user) {
    return res.sendStatus(404); // Not Found
  }

  // Set the password reset token and expiration
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  // Send the token to the user's email
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-password',
    },
  });

  const mailOptions = {
    to: user.email,
    from: 'your-email@gmail.com',
    subject: 'Password Reset',
    text: 'Please click the following link to reset your password:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email.\n',
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) return res.sendStatus(500); // Internal Server Error

    res.sendStatus(200);
  });
});

app.post('/reset/:token', (req, res) => {
  // Find the user
  const user = users.find(u => u.resetPasswordToken === req.params.token && u.resetPasswordExpires > Date.now());

  if (!user) {
    return res.sendStatus(400); // Bad Request
  }

  // Update the user's password
  user.password = bcrypt.hashSync(req.body.password, 10);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  res.sendStatus(200);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
