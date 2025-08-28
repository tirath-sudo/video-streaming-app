// server/controllers/auth.js
import jwt from 'jsonwebtoken';
import users from '../models/auth.js';

export const login = async (req, res) => {
  try {
    // 1) Validate + sanitize input
    const rawEmail = req.body?.email;
    if (typeof rawEmail !== 'string') {
      console.error('[LOGIN] Invalid email type:', typeof rawEmail, 'body:', req.body);
      return res.status(400).json({ message: 'Email is required' });
    }
    const email = rawEmail.trim().toLowerCase();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      console.error('[LOGIN] Bad email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // 2) Ensure JWT secret present
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[LOGIN] Missing JWT_SECRET');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    // 3) Find or create user
    let existingUser = await users.findOne({ email });
    if (!existingUser) {
      console.log('[LOGIN] New user creation for:', email);
      existingUser = await users.create({ email });
    }

    // 4) Sign token
    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: '1h' }
    );

    // 5) Respond
    console.log('[LOGIN] Success for:', email, 'userId:', existingUser._id.toString());
    res.status(200).json({ result: existingUser, token });
  } catch (err) {
    console.error('[LOGIN] Error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
