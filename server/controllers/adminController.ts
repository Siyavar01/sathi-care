import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Professional from '../models/professionalModel.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

// @desc    Get all unverified professionals
// @route   GET /api/admin/unverified-professionals
// @access  Private (Admin)
const getUnverifiedProfessionals = asyncHandler(
  async (req: Request, res: Response) => {
    const professionals = await Professional.find({
      isVerified: false,
    }).populate('user', ['name', 'email']);
    res.status(200).json(professionals);
  }
);

// @desc    Verify a professional's profile
// @route   PUT /api/admin/verify-professional/:id
// @access  Private (Admin)
const verifyProfessional = asyncHandler(
  async (req: Request, res: Response) => {
    const professional = await Professional.findById(req.params.id);

    if (professional) {
      professional.isVerified = true;
      await professional.save();
      res.status(200).json({ message: 'Professional has been verified' });
    } else {
      res.status(404);
      throw new Error('Professional not found');
    }
  }
);

export { getAllUsers, getUnverifiedProfessionals, verifyProfessional };