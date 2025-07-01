const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log("HIT AUTH MIDDLEWARE", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("NO TOKEN PROVIDED");
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId ? { id: decoded.userId } : decoded;
    console.log("JWT VERIFIED, req.user:", req.user);
    next();
  } catch (err) {
    console.error('JWT verify error:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}; 