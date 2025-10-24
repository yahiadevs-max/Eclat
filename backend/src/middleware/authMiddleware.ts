import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.split(' ')[1];
            req.user = jwt.verify(token, process.env.JWT_SECRET!) as Express.User;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const superadmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a superadmin' });
    }
};