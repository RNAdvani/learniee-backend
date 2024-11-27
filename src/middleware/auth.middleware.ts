import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token

  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
    return; 
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded as { userId: string };
    next(); 
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
    return; 
  }
};

export default auth;