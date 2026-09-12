import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
