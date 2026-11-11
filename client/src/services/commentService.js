import api from './api';

export const commentService = {
  async getComments(postId, chapterId = null) {
    const params = { postId };
    if (chapterId) params.chapterId = chapterId;
    const res = await api.get('/comments', { params });
    return res.data;
  },

  async addComment(data) {
    const res = await api.post('/comments', data);
    return res.data;
  },

  async deleteComment(id) {
    const res = await api.delete(`/comments/${id}`);
    return res.data;
  },

  async toggleLikeComment(id) {
    const res = await api.post(`/comments/${id}/like`);
    return res.data;
  },
};
