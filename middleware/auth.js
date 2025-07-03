const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = auth.split(' ')[1];
    const user = jwt.verify(token, SECRET);
    req.user = user; // attach user to request
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
