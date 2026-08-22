const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Naya user register karne ke liye (abhi ke liye khula hai, baad mein sirf Admin restrict kar sakte hain)
const register = async (req, res) => {
  try {
    const { Username, Password, Role } = req.body;

    if (!Username || !Password) {
      return res.status(400).json({ message: 'Username aur Password zaroori hai' });
    }
    if (Password.length < 6) {
      return res.status(400).json({ message: 'Password kam se kam 6 characters ka hona chahiye' });
    }

    // Check karo Username already exist toh nahi karta
    const existingUser = await User.findOne({ where: { Username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Ye Username already liya hua hai' });
    }

    // Password ko hash (scramble) karte hain - 10 "rounds" of scrambling
    const passwordHash = await bcrypt.hash(Password, 10);

    const newUser = await User.create({
      Username,
      PasswordHash: passwordHash,
      Role: Role || 'Staff',
    });

    res.status(201).json({ message: 'User successfully register hua', UserID: newUser.UserID });
  } catch (error) {
    res.status(500).json({ message: 'Register karne mein error aaya', error: error.message });
  }
};

// Login karne ke liye
const login = async (req, res) => {
  try {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res.status(400).json({ message: 'Username aur Password zaroori hai' });
    }

    const user = await User.findOne({ where: { Username } });
    if (!user) {
      return res.status(401).json({ message: 'Username ya Password galat hai' });
    }

    // Type kiya hua password, database ke hashed password se compare karte hain
    const isMatch = await bcrypt.compare(Password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Username ya Password galat hai' });
    }

    // JWT token banate hain
    const token = jwt.sign(
      { UserID: user.UserID, Username: user.Username, Role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { UserID: user.UserID, Username: user.Username, Role: user.Role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login karne mein error aaya', error: error.message });
  }
};

module.exports = { register, login };