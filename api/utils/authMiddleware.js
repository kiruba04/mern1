import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticateAdmin = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(404).send('No token provided.');
  try {
    const decoded = jwt.verify(token, process.env.jwt);
    const user = await User.findById(decoded.id);
    if (!user || !user.isAdmin) return res.status(403).send('Not authorized.');
    req.user = user;
    next();
  } catch (err) {
    res.status(500).send('Failed to authenticate token.');
  }
};

export default authenticateAdmin;
