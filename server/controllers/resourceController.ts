import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Resource from '../models/resourceModel.ts';
import { IUser } from '../models/userModel.ts';

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private (Admin)
const createResource = asyncHandler(async (req: Request, res: Response) => {
  const { title, category, pdfUrl, imageUrl } = req.body;
  const user = req.user as IUser;

  if (!title || !category || !pdfUrl || !imageUrl) {
    res.status(400);
    throw new Error('Please provide all required fields for the resource.');
  }

  const resource = await Resource.create({
    title,
    category,
    pdfUrl,
    imageUrl,
    addedBy: user._id,
  });

  res.status(201).json(resource);
});

// @desc    Get all resources
// @route   GET /api/resources
// @access  Public
const getAllResources = asyncHandler(async (req: Request, res: Response) => {
  const resources = await Resource.find({}).sort({ category: 1, createdAt: -1 });
  res.status(200).json(resources);
});

export { createResource, getAllResources };