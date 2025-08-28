import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import users from '../models/auth.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const secret = process.env.JWT_SECRET || process.env.SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
    }

    let existingUser = await users.findOne({ email });

    if (!existingUser) {
      // signup flow
      const hashedPassword = await bcrypt.hash(password, 12);
      existingUser = await users.create({ email, password: hashedPassword });
    } else {
      // login flow
      const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ result: existingUser, token });
  } catch (err) {
    console.error("[LOGIN] Error:", err);
    return res.status(500).json({ message: "Internal server error", error: err.message });
  }
};
