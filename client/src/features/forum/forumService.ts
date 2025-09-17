import api from '../../api/axiosConfig.js';

const getAllPosts = async () => {
  const response = await api.get('/api/forum/' + 'posts');
  return response.data;
};

const getPostById = async (postId: string) => {
  const response = await api.get('/api/forum/' + `posts/${postId}`);
  return response.data;
};

const createPost = async (postData: { title: string; content: string; isAnonymous: boolean }, token: string) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await api.post('/api/forum/' + 'posts', postData, config);
  return response.data;
};

const createComment = async (postId: string, commentData: { content: string; isAnonymous: boolean }, token: string) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await api.post('/api/forum/' + `posts/${postId}/comments`, commentData, config);
    return response.data;
}

const forumService = {
  getAllPosts,
  getPostById,
  createPost,
  createComment,
};

export default forumService;