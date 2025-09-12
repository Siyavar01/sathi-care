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
    const user = req.user as IUser & { createdAt: Date };
    const token = generateToken(user._id.toString());

    const isNewUser = (new Date().getTime() - new Date(user.createdAt).getTime()) < 10000;

    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: token,
      googleId: user.googleId,
      latestSubmissionId: user.latestSubmissionId,
      isNewUser: isNewUser,
    };

    const userString = encodeURIComponent(JSON.stringify(userData));
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?user=${userString}`);
  }
);

export default router;