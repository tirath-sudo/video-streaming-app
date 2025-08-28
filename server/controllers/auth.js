
import jwt from 'jsonwebtoken';
import users from '../models/auth.js';

export const login = async (req, res) => {
  try {
    console.log('[LOGIN] Incoming body:', req.body);

    // Validate input
    const rawEmail = req.body?.email;
    if (typeof rawEmail !== 'string' || !rawEmail.trim()) {
      console.error('[LOGIN] Invalid email provided:', rawEmail);
      return res.status(400).json({ message: 'Email is required' });
    }
    const email = rawEmail.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      console.error('[LOGIN] Invalid email format:', email);
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Support multiple names for JWT secret
    const secret = process.env.JWT_SECRET || process.env.SECRET;
    if (!secret) {
      console.error('[LOGIN] Missing JWT secret (JWT_SECRET or SECRET)');
      return res.status(500).json({ message: 'Server misconfiguration: JWT secret missing' });
    }
    console.log('[LOGIN] JWT secret present (hidden)');

    // Find or create user with guarded DB errors
    let existingUser;
    try {
      existingUser = await users.findOne({ email });
      console.log('[LOGIN] DB lookup result:', existingUser ? existingUser._id?.toString() : null);
    } catch (dbErr) {
      console.error('[LOGIN] Database lookup error:', dbErr);
      return res.status(500).json({ message: 'Database lookup error', error: dbErr.message });
    }

    if (!existingUser) {
      try {
        existingUser = await users.create({ email });
        console.log('[LOGIN] User auto-created with id:', existingUser._id?.toString());
      } catch (createErr) {
        // Provide full error info for debugging (safe during dev)
        console.error('[LOGIN] User creation failed:', createErr);
        return res.status(500).json({
          message: 'User creation failed',
          error: createErr.message,
          code: createErr.code,
          keyValue: createErr.keyValue
        });
      }
    }

    // Sign JWT token (guarded)
    let token;
    try {
      token = jwt.sign({ email: existingUser.email, id: existingUser._id }, secret, { expiresIn: '1h' });
      console.log('[LOGIN] Token generated for user:', existingUser._id?.toString());
    } catch (jwtErr) {
      console.error('[LOGIN] Token signing failed:', jwtErr);
      return res.status(500).json({ message: 'Token generation failed', error: jwtErr.message });
    }

    // Success
    return res.status(200).json({ result: existingUser, token });
  } catch (err) {
    console.error('[LOGIN] Uncaught error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Internal server error', error: err?.message });
  }
};
