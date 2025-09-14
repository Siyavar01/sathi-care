import { Schema, model, Document, Types } from 'mongoose';

export interface IComment extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;
  content: string;
  isAnonymous: boolean;
  flagged?: boolean;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    content: {
      type: String,
      required: true,
      maxLength: 2000,
    },
    isAnonymous: {
      type: Boolean,
      required: true,
      default: false,
    },
    flagged: {
        type: Boolean,
        default: false,
    }
  },
  { timestamps: true }
);

const Comment = model<IComment>('Comment', commentSchema);

export default Comment;