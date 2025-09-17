import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './userModel.js';
import { IQuestion } from './questionnaireModel.js';

export interface IResponse extends Document {
  user: IUser['_id'];
  question: IQuestion['_id'];
  answer: string;
  submissionId: string;
}

const responseSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    question: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    submissionId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Response = mongoose.model<IResponse>('Response', responseSchema);

export default Response;