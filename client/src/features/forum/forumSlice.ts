import { create } from 'zustand';
import forumService from './forumService';
import type { IPost, IComment } from '../../types';

interface ForumState {
  posts: IPost[];
  activePost: IPost | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  message: string;
  getAllPosts: () => Promise<void>;
  getPostById: (postId: string) => Promise<void>;
  createPost: (postData: { title: string; content: string; isAnonymous: boolean }, token: string) => Promise<void>;
  createComment: (postId: string, commentData: { content: string; isAnonymous: boolean }, token: string) => Promise<void>;
  addPostRealTime: (post: IPost) => void;
  addCommentRealTime: (comment: IComment) => void;
  reset: () => void;
}

const useForumStore = create<ForumState>((set, get) => ({
  posts: [],
  activePost: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',

  getAllPosts: async () => {
    set({ isLoading: true });
    try {
      const posts = await forumService.getAllPosts();
      set({ isLoading: false, isSuccess: true, posts });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },

  getPostById: async (postId) => {
    set({ isLoading: true });
    try {
      const post = await forumService.getPostById(postId);
      set({ isLoading: false, isSuccess: true, activePost: post });
    } catch (error: any) {
      const message = (error.response?.data?.message) || error.message || error.toString();
      set({ isLoading: false, isError: true, message });
    }
  },

  createPost: async (postData, token) => {
    await forumService.createPost(postData, token);
  },

  createComment: async (postId, commentData, token) => {
    await forumService.createComment(postId, commentData, token);
  },

  addPostRealTime: (post) => {
    set((state) => ({
      posts: [post, ...state.posts],
    }));
  },

  addCommentRealTime: (comment) => {
    const { activePost } = get();
    if (activePost && activePost._id === comment.post) {
      set({
        activePost: {
          ...activePost,
          comments: [...activePost.comments, comment],
        },
      });
    }
  },

  reset: () => set({
    posts: [],
    activePost: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
  }),
}));

export default useForumStore;