import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import User, { IUser } from '../models/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];

        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;

        const foundUser = (await User.findById(decoded.id).select(
          '-password'
        )) as IUser | null;

        if (!foundUser) {
          res.status(401);
          throw new Error('Not authorized, user not found');
        }

        req.user = foundUser;
        next();
      } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token');
    }
  }
);

const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `User role ${req.user?.role} is not authorized to access this route`
      );
    }
    next();
  };
};

export { protect, authorize };