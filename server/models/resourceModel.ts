import { Schema, model, Document, Types } from 'mongoose';

export interface IResource extends Document {
  title: string;
  category: 'Anxiety & Depression' | 'Stress Management' | 'Self Care';
  pdfUrl: string;
  imageUrl: string;
  addedBy: Types.ObjectId;
}

const resourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Anxiety & Depression', 'Stress Management', 'Self Care'],
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Resource = model<IResource>('Resource', resourceSchema);

export default Resource;