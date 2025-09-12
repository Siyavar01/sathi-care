import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  role: 'user' | 'professional' | 'admin' | 'institution';
  paymentGatewayCustomerId?: string;
  latestSubmissionId?: string;
}

const userSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ['user', 'professional', 'admin', 'institution'],
      default: 'user',
    },
    paymentGatewayCustomerId: {
      type: String,
    },
    latestSubmissionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;