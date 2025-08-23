import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional because it won't be sent back to the client
  googleId?: string; // For Google OAuth
  role: 'user' | 'professional' | 'admin' | 'institution';
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
      // Not required because a user might sign up with Google OAuth
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;