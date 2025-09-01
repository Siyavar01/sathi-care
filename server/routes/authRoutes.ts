import express from 'express';
import passport from 'passport';
import generateToken from '../utils/generateToken.ts';
import { IUser } from '../models/userModel.ts';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  (req, res) => {
    const user = req.user as IUser;
    const token = generateToken(user._id);

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
    };

    const userString = encodeURIComponent(JSON.stringify(userData));
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?user=${userString}`);
  }
);

export default router;