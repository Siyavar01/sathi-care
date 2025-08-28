import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IProfessional extends Document {
  user: Types.ObjectId;
  title: 'Therapist' | 'Psychiatrist';
  bio: string;
  specializations: string[];
  experience: number;
  languages: string[];
  isVerified: boolean;
  proBono: boolean;
}

const professionalSchema: Schema<IProfessional> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true,
    },
    title: {
      type: String,
      required: true,
      enum: ['Therapist', 'Psychiatrist'],
    },
    bio: {
      type: String,
      required: true,
    },
    specializations: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    languages: {
      type: [String],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    proBono: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Professional = mongoose.model<IProfessional>(
  'Professional',
  professionalSchema
);

export default Professional;