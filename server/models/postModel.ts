import { Schema, model, Document, Types } from 'mongoose';

export interface IPost extends Document {
  user: Types.ObjectId;
  title: string;
  content: string;
  isAnonymous: boolean;
  comments: Types.ObjectId[];
  flagged?: boolean;
}

const postSchema = new Schema<IPost>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    content: {
      type: String,
      required: true,
      maxLength: 5000,
    },
    isAnonymous: {
      type: Boolean,
      required: true,
      default: false,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    flagged: {
        type: Boolean,
        default: false,
    }
  },
  { timestamps: true }
);

const Post = model<IPost>('Post', postSchema);

export default Post;