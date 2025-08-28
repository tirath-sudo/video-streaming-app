// server/controllers/auth.js
import jwt from 'jsonwebtoken';
import users from '../models/auth.js';

export const login = async (req, res) => {
  try {
    console.log('[LOGIN] Incoming body:', req.body);

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

    console.log('[LOGIN] Email validated:', email);

    // 2) Ensure JWT secret present
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('[LOGIN] Missing JWT_SECRET');
      return res.status(500).json({ message: 'Server misconfiguration: JWT_SECRET missing' });
    }
    console.log('[LOGIN] JWT_SECRET exists');

    // 3) Find or create user
    let existingUser;
    try {
      existingUser = await users.findOne({ email });
      console.log('[LOGIN] User lookup result:', existingUser);
    } catch (dbErr) {
      console.error('[LOGIN] DB lookup error:', dbErr);
      return res.status(500).json({ message: 'Database error' });
    }

    if (!existingUser) {
      console.log('[LOGIN] New user creation for:', email);
      try {
        existingUser = await users.create({ email });
        console.log('[LOGIN] User created:', existingUser._id.toString());
      } catch (createErr) {
        console.error('[LOGIN] User creation failed:', createErr);
        return res.status(500).json({ message: 'User creation failed' });
      }
    }

    // 4) Sign token
    let token;
    try {
      token = jwt.sign(
        { email: existingUser.email, id: existingUser._id },
        secret,
        { expiresIn: '1h' }
      );
      console.log('[LOGIN] Token signed successfully');
    } catch (jwtErr) {
      console.error('[LOGIN] Token signing error:', jwtErr);
      return res.status(500).json({ message: 'Token generation failed' });
    }

    // 5) Respond
    console.log('[LOGIN] Success for:', email, 'userId:', existingUser._id.toString());
    res.status(200).json({ result: existingUser, token });
  } catch (err) {
    console.error('[LOGIN] Uncaught Error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
