import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
import { IUser } from '../models/userModel.js';
import { moderationService } from '../services/moderationService.js';

const checkAndFlagContent = async (type: 'post' | 'comment', id: string) => {
  try {
    if (type === 'post') {
      const post = await Post.findById(id);
      if (post) {
        const moderationResult = await moderationService.analyzeText(`${post.title} ${post.content}`);
        if (moderationResult.isToxic) {
          post.flagged = true;
          await post.save();
        }
      }
    } else {
      const comment = await Comment.findById(id);
      if (comment) {
        const moderationResult = await moderationService.analyzeText(comment.content);
        if (moderationResult.isToxic) {
          comment.flagged = true;
          await comment.save();
        }
      }
    }
  } catch (error) {
    console.error(`[Moderation] Failed to moderate ${type} ${id}:`, error);
  }
};


// @desc    Create a new post
// @route   POST /api/forum/posts
// @access  Private
const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, isAnonymous } = req.body;
  const user = req.user as IUser;

  if (!title || !content) {
    res.status(400);
    throw new Error('Title and content are required');
  }

  const post = await Post.create({
    user: user._id, title, content, isAnonymous: isAnonymous || false,
  });

  const populatedPost = await Post.findById(post._id).populate('user', 'name');
  const postObject = populatedPost!.toObject();
  if (postObject.isAnonymous) {
      (postObject.user as any).name = 'Anonymous';
  }

  checkAndFlagContent('post', post._id);

  req.io.emit('newPost', postObject);
  res.status(201).json(postObject);
});

// @desc    Add a comment to a post
// @route   POST /api/forum/posts/:id/comments
// @access  Private
const createComment = asyncHandler(async (req: Request, res: Response) => {
    const { content, isAnonymous } = req.body;
    const postId = req.params.id;
    const user = req.user as IUser;

    if (!content) {
        res.status(400);
        throw new Error('Comment content is required');
    }

    const post = await Post.findById(postId);
    if (!post || post.flagged) {
        res.status(404);
        throw new Error('Post not found or has been removed.');
    }

    const comment = await Comment.create({
        user: user._id, post: postId, content, isAnonymous: isAnonymous || false,
    });

    post.comments.push(comment._id);
    await post.save();

    checkAndFlagContent('comment', comment._id);

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name');
    const commentObject = populatedComment!.toObject();
    if(commentObject.isAnonymous) {
        (commentObject.user as any).name = 'Anonymous';
    }

    req.io.emit('newComment', commentObject);
    res.status(201).json(commentObject);
});


// @desc    Get all posts (filters out flagged content)
// @route   GET /api/forum/posts
// @access  Public
const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts = await Post.find({ flagged: { $ne: true } })
    .populate('user', 'name')
    .sort({ createdAt: -1 });

  const anonymizedPosts = posts.map(post => {
      const postObject = post.toObject();
      if (postObject.isAnonymous) {
          (postObject.user as any).name = 'Anonymous';
      }
      return postObject;
  });

  res.status(200).json(anonymizedPosts);
});

// @desc    Get a single post by ID (filters out flagged content)
// @route   GET /api/forum/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.id)
        .populate('user', 'name')
        .populate({
            path: 'comments',
            match: { flagged: { $ne: true } },
            populate: {
                path: 'user',
                select: 'name'
            },
            options: { sort: { createdAt: 1 } }
        });

    if (!post || post.flagged) {
        res.status(404);
        throw new Error('Post not found or has been removed for moderation.');
    }

    const postObject = post.toObject();
    if (postObject.isAnonymous) {
        (postObject.user as any).name = 'Anonymous';
    }
    postObject.comments = postObject.comments.map((comment: any) => {
        if (comment.isAnonymous) {
            comment.user.name = 'Anonymous';
        }
        return comment;
    });

    res.status(200).json(postObject);
});


export { createPost, getAllPosts, getPostById, createComment };