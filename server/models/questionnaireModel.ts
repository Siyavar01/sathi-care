import { Schema, model, Document } from 'mongoose';

export interface IQuestion extends Document {
  category: 'Anxiety' | 'Depression' | 'Stress Management';
  text: string;
  options: string[];
}

const questionSchema = new Schema<IQuestion>(
  {
    category: {
      type: String,
      required: true,
      enum: ['Anxiety', 'Depression', 'Stress Management'],
    },
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Question = model<IQuestion>('Question', questionSchema);

export default Question;