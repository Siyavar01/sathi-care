import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.ts';
import Professional from '../models/professionalModel.ts';
import { IUser } from '../models/userModel.ts';

// @desc    Upload a credential file for a professional
// @route   POST /api/professionals/credentials/upload
// @access  Private (Professional)
const uploadCredential = asyncHandler(async (req: Request, res: Response) => {
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
      folder: `sathi-care/credentials/${user._id}`,
      resource_type: 'auto',
    },
    async (error, result) => {
      if (error || !result) {
        res.status(500);
        throw new Error('File upload to Cloudinary failed');
      }

      professionalProfile.credentials.push({
        name: req.file!.originalname,
        url: result.secure_url,
      });

      const updatedProfile = await professionalProfile.save();
      res.status(200).json(updatedProfile);
    }
  );

  uploadStream.end(req.file.buffer);
});

export { uploadCredential };