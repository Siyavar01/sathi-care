import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { randomUUID } from 'crypto';
import Question from '../models/questionnaireModel';
import ResponseModel from '../models/responseModel';
import { IUser } from '../models/userModel';

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser | null;
  }
}

// @desc    Get all questions
// @route   GET /api/questionnaire
// @access  Private
const getQuestions = asyncHandler(async (req: Request, res: Response) => {
  const questions = await Question.find({});
  res.status(200).json(questions);
});

// @desc    Submit questionnaire responses
// @route   POST /api/questionnaire/submit
// @access  Private
const submitResponses = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { responses } = req.body;

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    res.status(400);
    throw new Error('Responses are required and must be an array.');
  }

  const submissionId = randomUUID();

  const responseDocs = responses.map((response: any) => ({
    user: user._id,
    question: response.questionId,
    answer: response.answer,
    submissionId: submissionId,
  }));

  await ResponseModel.insertMany(responseDocs);

  res.status(201).json({
    message: 'Responses submitted successfully.',
    submissionId: submissionId,
  });
});

export { getQuestions, submitResponses };