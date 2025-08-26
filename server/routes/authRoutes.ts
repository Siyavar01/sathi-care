import express from 'express';
import passport from 'passport';
import generateToken from '../utils/generateToken';
import { IUser } from '../models/userModel';

const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const user = req.user as IUser;
    const token = generateToken(user._id);

    res.status(200).json({
        message: "Auth successful",
        token: token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
    });
  }
);

export default router;