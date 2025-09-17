import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import Professional from '../models/professionalModel.js';
import { IUser } from '../models/userModel.js';

// @desc    Upload a credential file for a professional
// @route   POST /api/professionals/credentials/upload
// @access  Private (Professional)
const uploadCredential = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { credentialName } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  if (!credentialName) {
    res.status(400);
    throw new Error('Credential name is required');
  }

  const professionalProfile = await Professional.findOne({ user: user._id });

  if (!professionalProfile) {
    res.status(404);
    throw new Error('Professional profile not found');
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: `sathi-care/credentials/${user._id}`,
      resource_type: 'auto',
    },
    async (error, result) => {
      if (error || !result) {
        res.status(500);
        throw new Error('File upload to Cloudinary failed');
      }

      professionalProfile.credentials.push({
        name: credentialName,
        url: result.secure_url,
      });

      const updatedProfile = await professionalProfile.save();
      res.status(200).json(updatedProfile);
    }
  );

  uploadStream.end(req.file.buffer);
});

// @desc    Upload a profile picture for a professional
// @route   POST /api/professionals/profile/upload-picture
// @access  Private (Professional)
const uploadProfilePicture = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;

  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  const professionalProfile = await Professional.findOne({ user: user._id });

  if (!professionalProfile) {
    res.status(404);
    throw new Error('Professional profile not found');
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: `sathi-care/profile-pictures/${user._id}`,
      resource_type: 'image',
      public_id: 'profile_picture',
      overwrite: true,
    },
    async (error, result) => {
      if (error || !result) {
        res.status(500);
        throw new Error('Image upload to Cloudinary failed');
      }

      professionalProfile.profilePictureUrl = result.secure_url;

      const updatedProfile = await professionalProfile.save();
      res.status(200).json(updatedProfile);
    }
  );

  uploadStream.end(req.file.buffer);
});

export { uploadCredential, uploadProfilePicture };