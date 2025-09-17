import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Question from '../models/questionnaireModel.js';
import ResponseModel from '../models/responseModel.js';
import User, { IUser } from '../models/userModel.js';
import { v4 as uuidv4 } from 'uuid';
import generateToken from '../utils/generateToken.js';

const getQuestions = asyncHandler(async (req: Request, res: Response) => {
  const questions = await Question.find({});
  res.json(questions);
});

const submitAnswers = asyncHandler(async (req: Request, res: Response) => {
  const { answers } = req.body;
  const user = req.user as IUser;

  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    res.status(400);
    throw new Error('Answers are required');
  }

  const submissionId = uuidv4();

  const responsesToSave = answers.map((ans) => ({
    user: user._id,
    question: ans.question,
    answer: ans.answer,
    submissionId,
  }));

  await ResponseModel.insertMany(responsesToSave);

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { latestSubmissionId: submissionId },
    { new: true }
  );

  if (updatedUser) {
    res.status(201).json({
      message: 'Responses submitted successfully',
      submissionId,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        googleId: updatedUser.googleId,
        latestSubmissionId: updatedUser.latestSubmissionId,
        token: generateToken(updatedUser._id.toString()),
      }
    });
  } else {
      res.status(404);
      throw new Error('User not found after submission.');
  }
});

export { getQuestions, submitAnswers };