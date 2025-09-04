import { Schema, model, Document, Types } from 'mongoose';

export interface ISessionType {
  _id: Types.ObjectId;
  type: string;
  duration: number;
  price: number;
  isProBono: boolean;
}

export interface IProfessional extends Document {
  user: Types.ObjectId;
  title: 'Therapist' | 'Psychiatrist';
  bio: string;
  specializations: string[];
  experience: number;
  offersProBono: boolean;
  sessionTypes: ISessionType[];
  isVerified: boolean;
  profilePictureUrl: string;
  languages: string[];
  acceptsInstitutionalOutreach: boolean;
  availability: {
    day: string;
    timeSlots: {
      startTime: string;
      endTime: string;
      sessionTypeId: Types.ObjectId;
    }[];
  }[];
  credentials: {
    name: string;
    url: string;
  }[];
}

const professionalSchema = new Schema<IProfessional>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User', unique: true },
    title: { type: String, required: true, enum: ['Therapist', 'Psychiatrist'] },
    bio: { type: String, required: true },
    specializations: { type: [String], required: true },
    experience: { type: Number, required: true },
    offersProBono: { type: Boolean, default: false },
    sessionTypes: [
      {
        type: { type: String, required: true },
        duration: { type: Number, required: true },
        price: { type: Number, required: true },
        isProBono: { type: Boolean, default: false },
      },
    ],
    isVerified: { type: Boolean, default: false },
    profilePictureUrl: { type: String, default: '' },
    languages: { type: [String], required: true },
    acceptsInstitutionalOutreach: { type: Boolean, default: false },
    availability: [
      {
        day: {
          type: String,
          required: true,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        timeSlots: [
          {
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            sessionTypeId: { type: Schema.Types.ObjectId, required: true },
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
  { timestamps: true }
);

const Professional = model<IProfessional>('Professional', professionalSchema);
export default Professional;