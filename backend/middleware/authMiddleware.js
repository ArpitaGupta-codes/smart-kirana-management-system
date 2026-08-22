const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  // Header mein token dhoondte hain: "Authorization: Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Login zaroori hai. Token nahi mila.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Token ko verify karte hain - kya ye valid hai aur expire toh nahi hua
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // User info ko request mein attach kar dete hain, aage use karne ke liye
    next(); // Sab sahi hai, aage badho
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid ya expire ho gaya hai' });
  }
};

module.exports = { protect };