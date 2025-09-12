import { Schema, model, Document, Types } from 'mongoose';

export interface IMoodEntry extends Document {
  user: Types.ObjectId;
  rating: number;
  notes?: string;
  entryDate: Date;
}

const moodEntrySchema = new Schema<IMoodEntry>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    notes: {
      type: String,
      maxLength: 1000,
    },
    entryDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const MoodEntry = model<IMoodEntry>('MoodEntry', moodEntrySchema);

export default MoodEntry;