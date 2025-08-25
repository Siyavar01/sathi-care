import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

const generateToken = (id: Types.ObjectId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in the .env file');
  }

  return jwt.sign({ id }, secret, {
    expiresIn: '30d',
  });
};

export default generateToken;