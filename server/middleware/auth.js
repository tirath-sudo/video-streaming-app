
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded?.id;
    return next();
  } catch (error) {
    console.error('[AUTH MIDDLEWARE] Error:', error?.message);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
};

export default auth;
