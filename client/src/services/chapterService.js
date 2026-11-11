import api from './api';

export const chapterService = {
  async addChapter(data) {
    const res = await api.post('/chapters', data);
    return res.data;
  },

  async getChaptersByPost(postId) {
    const res = await api.get(`/chapters/novel/${postId}`);
    return res.data;
  },

  async getChapterById(id) {
    const res = await api.get(`/chapters/${id}`);
    return res.data;
  },

  async updateChapter(id, data) {
    const res = await api.put(`/chapters/${id}`, data);
    return res.data;
  },

  async deleteChapter(id) {
    const res = await api.delete(`/chapters/${id}`);
    return res.data;
  },

  async toggleLikeChapter(id) {
    const res = await api.post(`/chapters/${id}/like`);
    return res.data;
  },
};
