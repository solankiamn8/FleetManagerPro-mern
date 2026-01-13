import jwt from 'jsonwebtoken';
import User from '../models/User.js'
import { env } from '../config/env.js';

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("+password");
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    if (user.status === "suspended") {
      return res.status(403).json({
        message: "Account suspended",
        code: "ACCOUNT_SUSPENDED",
      })
    }
    req.user = {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      organization: user.organization,
    };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const permit = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};
