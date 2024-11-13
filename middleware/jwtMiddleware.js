require('dotenv').config();
const jwt = require('jsonwebtoken');

function jwtGuard(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).json({
      status: 'error',
      message: 'Access denied, no token provided.',
      code: 403
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: 'error',
        message: 'Invalid or expired token.',
        code: 403
      });
    }
    req.user = user;
    next();
  });
}

module.exports = { jwtGuard };