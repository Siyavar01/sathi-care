import { Schema, model, Document, Types } from 'mongoose';

export interface IConnectionRequest extends Document {
  institution: Types.ObjectId;
  professional: Types.ObjectId;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
}

const connectionRequestSchema = new Schema<IConnectionRequest>(
  {
    institution: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'InstitutionProfile',
    },
    professional: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Professional',
    },
    message: {
      type: String,
      required: true,
      maxLength: 2000,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const ConnectionRequest = model<IConnectionRequest>(
  'ConnectionRequest',
  connectionRequestSchema
);

export default ConnectionRequest;