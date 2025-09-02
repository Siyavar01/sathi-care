import { Schema, model, Document, Types } from 'mongoose';

export interface IProfessional extends Document {
  user: Types.ObjectId;
  title: 'Therapist' | 'Psychiatrist';
  bio: string;
  specializations: string[];
  experience: number;
  proBono: boolean;
  isVerified: boolean;
  profilePictureUrl: string;
  languages: string[];
  availability: {
    day: string;
    timeSlots: {
      startTime: string;
      endTime: string;
    }[];
  }[];
  credentials: {
    name: string;
    url: string;
  }[];
}

const professionalSchema = new Schema<IProfessional>(
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
    proBono: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profilePictureUrl: {
      type: String,
      default: '',
    },
    languages: {
      type: [String],
      required: true,
    },
    availability: [
      {
        day: {
          type: String,
          required: true,
          enum: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
        },
        timeSlots: [
          {
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
          },
        ],
      },
    ],
    credentials: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Professional = model<IProfessional>(
  'Professional',
  professionalSchema
);

export default Professional;