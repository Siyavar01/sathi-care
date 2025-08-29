import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  text: string;
  options: string[];
  category: 'Anxiety' | 'Depression' | 'Stress' | 'General';
}

const questionSchema: Schema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      // Example: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
    },
    category: {
      type: String,
      required: true,
      enum: ['Anxiety', 'Depression', 'Stress', 'General'],
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model<IQuestion>('Question', questionSchema);

export default Question;