import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import InstitutionProfile from '../models/institutionProfileModel.ts';
import ConnectionRequest from '../models/connectionRequestModel.ts';
import { IUser } from '../models/userModel.ts';

// @desc    Create or update an institution profile
// @route   POST /api/institutions/profile
// @access  Private (Institution)
const createOrUpdateInstitutionProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { institutionName, address, contactPerson, contactEmail, website } =
      req.body;

    const user = req.user as IUser;

    const profileFields = {
      user: user._id,
      institutionName,
      address,
      contactPerson,
      contactEmail,
      website,
    };

    let institutionProfile = await InstitutionProfile.findOne({ user: user._id });

    if (institutionProfile) {
      institutionProfile = await InstitutionProfile.findOneAndUpdate(
        { user: user._id },
        { $set: profileFields },
        { new: true, runValidators: true }
      );
    } else {
      institutionProfile = await InstitutionProfile.create(profileFields);
    }

    res.status(200).json(institutionProfile);
  }
);

// @desc    Get current institution's profile
// @route   GET /api/institutions/profile/me
// @access  Private (Institution)
const getMyInstitutionProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const profile = await InstitutionProfile.findOne({
      user: user._id,
    }).populate('user', ['name', 'email']);

    if (!profile) {
      res.status(404);
      throw new Error('There is no institution profile for this user');
    }

    res.json(profile);
  }
);

// @desc    Create a new connection request to a professional
// @route   POST /api/institutions/connect
// @access  Private (Institution)
const createConnectionRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { professionalId, message } = req.body;
    const user = req.user as IUser;

    const institutionProfile = await InstitutionProfile.findOne({ user: user._id });

    if (!institutionProfile) {
      res.status(404);
      throw new Error('Institution profile not found');
    }

    const newRequest = await ConnectionRequest.create({
      institution: institutionProfile._id,
      professional: professionalId,
      message,
    });

    res.status(201).json(newRequest);
  }
);

// @desc    Get all connection requests sent by the institution
// @route   GET /api/institutions/requests
// @access  Private (Institution)
const getMyConnectionRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const institutionProfile = await InstitutionProfile.findOne({ user: user._id });

    if (!institutionProfile) {
      res.status(404);
      throw new Error('Institution profile not found');
    }

    const requests = await ConnectionRequest.find({
      institution: institutionProfile._id,
    }).populate({
      path: 'professional',
      select: 'user',
      populate: {
        path: 'user',
        select: 'name',
      },
    });

    res.status(200).json(requests);
  }
);


export {
  createOrUpdateInstitutionProfile,
  getMyInstitutionProfile,
  createConnectionRequest,
  getMyConnectionRequests,
};