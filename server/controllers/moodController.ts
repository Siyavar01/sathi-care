import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import MoodEntry from '../models/moodEntryModel.ts';
import { IUser } from '../models/userModel.ts';

// @desc    Create a new mood entry
// @route   POST /api/moods
// @access  Private (User)
const createMoodEntry = asyncHandler(async (req: Request, res: Response) => {
  const { rating, notes, entryDate } = req.body;
  const user = req.user as IUser;

  if (!rating) {
    res.status(400);
    throw new Error('A rating is required to create a mood entry.');
  }

  const moodEntry = await MoodEntry.create({
    user: user._id,
    rating,
    notes,
    entryDate: entryDate || new Date(),
  });

  res.status(201).json(moodEntry);
});

// @desc    Get all mood entries for the logged-in user
// @route   GET /api/moods/my
// @access  Private (User)
const getMyMoodEntries = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;

  const entries = await MoodEntry.find({ user: user._id }).sort({ entryDate: 'asc' });

  res.status(200).json(entries);
});

export { createMoodEntry, getMyMoodEntries };