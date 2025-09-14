import axios from 'axios';

const API_URL = '/api/forum/';

const getAllPosts = async () => {
  const response = await axios.get(API_URL + 'posts');
  return response.data;
};

const getPostById = async (postId: string) => {
  const response = await axios.get(API_URL + `posts/${postId}`);
  return response.data;
};

const createPost = async (postData: { title: string; content: string; isAnonymous: boolean }, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL + 'posts', postData, config);
  return response.data;
};

const createComment = async (postId: string, commentData: { content: string; isAnonymous: boolean }, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL + `posts/${postId}/comments`, commentData, config);
    return response.data;
}

const forumService = {
  getAllPosts,
  getPostById,
  createPost,
  createComment,
};

export default forumService;