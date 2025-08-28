import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Professional from '../models/professionalModel';
import User, { IUser } from '../models/userModel';

declare global {
  namespace Express {
    interface Request {
      user?: IUser | null;
    }
  }
}

// @desc    Create or update a professional profile
// @route   POST /api/professionals/profile
// @access  Private (Professional)
const createOrUpdateProfessionalProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { title, bio, specializations, experience, languages, proBono } =
      req.body;

    if (
      !title ||
      !bio ||
      !specializations ||
      !experience ||
      !languages
    ) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const user = req.user!;

    const profileFields = {
      user: user._id,
      title,
      bio,
      specializations,
      experience,
      languages,
      proBono: proBono || false,
    };

    let professionalProfile = await Professional.findOne({ user: user._id });

    if (professionalProfile) {
      professionalProfile = await Professional.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true }
      );
    } else {
      professionalProfile = await Professional.create(profileFields);
      await User.findByIdAndUpdate(user._id, { role: 'professional' });
    }

    res.status(200).json(professionalProfile);
  }
);

// @desc    Get current professional's profile
// @route   GET /api/professionals/profile/me
// @access  Private (Professional)
const getMyProfessionalProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const profile = await Professional.findOne({ user: req.user!._id }).populate(
      'user',
      ['name', 'email']
    );

    if (!profile) {
      res.status(404);
      throw new Error('There is no professional profile for this user');
    }

    res.json(profile);
  }
);

// @desc    Get all verified professional profiles
// @route   GET /api/professionals
// @access  Public
const getAllProfessionals = asyncHandler(
  async (req: Request, res: Response) => {
    const profiles = await Professional.find({ isVerified: true }).populate(
      'user',
      ['name']
    );
    res.json(profiles);
  }
);

export {
  createOrUpdateProfessionalProfile,
  getMyProfessionalProfile,
  getAllProfessionals,
};