import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import User, { IUser } from '../models/userModel.ts';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.ts';
import ResponseModel from '../models/responseModel.ts';
import { v4 as uuidv4 } from 'uuid';

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && user.password && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
      latestSubmissionId: user.latestSubmissionId,
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  res.status(200).json(user);
});

// @desc    Register a new user AND submit their questionnaire answers
// @route   POST /api/users/register-and-submit
// @access  Public
const registerAndSubmit = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, answers } = req.body;

  if (!name || !email || !password || !answers) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const submissionId = uuidv4();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: 'user',
    latestSubmissionId: submissionId,
  });

  if (user) {
    const responsesToSave = answers.map((ans: any) => ({
      user: user._id,
      question: ans.question,
      answer: ans.answer,
      submissionId,
    }));
    await ResponseModel.insertMany(responsesToSave);

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString()),
      latestSubmissionId: user.latestSubmissionId,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

export { registerUser, registerAndSubmit, loginUser, getMe };