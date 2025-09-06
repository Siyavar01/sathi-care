import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Professional from '../models/professionalModel.ts';
import User, { IUser } from '../models/userModel.ts';
import ResponseModel from '../models/responseModel.ts';
import Question from '../models/questionnaireModel.ts';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser | null;
  }
}

// @desc    Create or update a professional profile
// @route   POST /api/professionals/profile
// @access  Private (Professional)
const createOrUpdateProfessionalProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      title,
      bio,
      specializations,
      experience,
      languages,
      offersProBono,
      acceptsInstitutionalOutreach,
      sessionTypes,
      availability,
    } = req.body;

    const user = req.user as IUser;

    if (!title || !bio || !specializations || !experience || !languages) {
      res.status(400);
      throw new Error('Please provide all required basic information fields');
    }

    const profileFields = {
      user: user._id,
      title,
      bio,
      specializations,
      experience,
      languages,
      offersProBono,
      acceptsInstitutionalOutreach,
      sessionTypes,
      availability,
    };

    let professionalProfile = await Professional.findOne({ user: user._id });

    if (professionalProfile) {
      professionalProfile = await Professional.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true, runValidators: true }
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
    const user = req.user as IUser;
    const profile = await Professional.findOne({ user: user._id }).populate(
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

// @desc    Get all verified professional profiles with filtering
// @route   GET /api/professionals
// @access  Public
const getAllProfessionals = asyncHandler(
  async (req: Request, res: Response) => {
    const { outreach, title, specializations, minExperience, languages, proBono } = req.query;

    const filter: any = { isVerified: true };

    if (outreach === 'true') {
      filter.acceptsInstitutionalOutreach = true;
    }
    if (title && typeof title === 'string') {
      filter.title = title;
    }
    if (specializations && typeof specializations === 'string') {
      filter.specializations = { $in: specializations.split(',') };
    }
    if (minExperience && !isNaN(Number(minExperience))) {
      filter.experience = { $gte: Number(minExperience) };
    }
    if (languages && typeof languages === 'string') {
      filter.languages = { $in: languages.split(',') };
    }
    if (proBono === 'true') {
      filter.offersProBono = true;
    }

    const profiles = await Professional.find(filter).populate('user', ['name']);
    res.json(profiles);
  }
);

// @desc    Get matched professionals based on questionnaire
// @route   POST /api/professionals/match
// @access  Private
const matchProfessionals = asyncHandler(async (req: Request, res: Response) => {
  const { submissionId } = req.body;
  const user = req.user as IUser;

  if (!submissionId) {
    res.status(400);
    throw new Error('Submission ID is required');
  }

  const responses = await ResponseModel.find({
    user: user._id,
    submissionId,
  }).populate({
    path: 'question',
    model: Question,
  });

  if (responses.length === 0) {
    res.status(404);
    throw new Error('No responses found for this submission ID');
  }

  const score: { [key: string]: number } = {};
  responses.forEach((response: any) => {
    const category = response.question.category;
    const answer = response.answer;
    let points = 0;
    if (answer === 'Several days') points = 1;
    if (answer === 'More than half the days') points = 2;
    if (answer === 'Nearly every day') points = 3;

    score[category] = (score[category] || 0) + points;
  });

  const primaryConcern = Object.keys(score).reduce((a, b) =>
    score[a] > score[b] ? a : b
  );

  const professionals = await Professional.find({ isVerified: true });

  const sortedProfessionals = [...professionals].sort((a, b) => {
    const aHasSpecialization = a.specializations.includes(primaryConcern);
    const bHasSpecialization = b.specializations.includes(primaryConcern);

    if (aHasSpecialization && !bHasSpecialization) return -1;
    if (!aHasSpecialization && bHasSpecialization) return 1;
    return 0;
  });

  res.json({ primaryConcern, recommendations: sortedProfessionals });
});

export {
  createOrUpdateProfessionalProfile,
  getMyProfessionalProfile,
  getAllProfessionals,
  matchProfessionals,
};