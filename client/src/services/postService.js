import api from './api';

export const postService = {
  async getPosts(params = {}) {
    const res = await api.get('/posts', { params });
    return res.data;
  },

  async getPostById(id) {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  },

  async createPost(data) {
    const res = await api.post('/posts', data);
    return res.data;
  },

  async updatePost(id, data) {
    const res = await api.put(`/posts/${id}`, data);
    return res.data;
  },

  async deletePost(id) {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  async toggleLike(id) {
    const res = await api.post(`/posts/${id}/like`);
    return res.data;
  },

  async toggleBookmark(id) {
    const res = await api.post(`/posts/${id}/bookmark`);
    return res.data;
  },
};
