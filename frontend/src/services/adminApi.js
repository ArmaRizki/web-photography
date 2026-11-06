import api from "./api";

export const adminApi = {
  login: (credentials) => api.post("/api/auth/login", credentials),

  getDashboardSummary: () => api.get("/api/admin/dashboard/summary"),

  uploadFile: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/admin/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Photos
  getPhotos: () => api.get("/api/public/photos"),
  createPhoto: (data) => api.post("/api/admin/photos", data),
  updatePhoto: (id, data) => api.put(`/api/admin/photos/${id}`, data),
  deletePhoto: (id) => api.delete(`/api/admin/photos/${id}`),

  // Categories
  getCategories: () => api.get("/api/public/categories"),
  createCategory: (data) => api.post("/api/admin/categories", data),
  updateCategory: (id, data) => api.put(`/api/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/api/admin/categories/${id}`),
  getPackages: () => api.get("/api/public/packages"),
  createPackage: (data) => api.post("/api/admin/packages", data),
  updatePackage: (id, data) => api.put(`/api/admin/packages/${id}`, data),
  deletePackage: (id) => api.delete(`/api/admin/packages/${id}`),
  getVideos: () => api.get("/api/public/videos"),
  createVideo: (data) => api.post("/api/admin/videos", data),
  updateVideo: (id, data) => api.put(`/api/admin/videos/${id}`, data),
  deleteVideo: (id) => api.delete(`/api/admin/videos/${id}`),
  getFaqs: () => api.get("/api/public/faqs"),
  createFaq: (data) => api.post("/api/admin/faqs", data),
  updateFaq: (id, data) => api.put(`/api/admin/faqs/${id}`, data),
  deleteFaq: (id) => api.delete(`/api/admin/faqs/${id}`),

  // Bookings
  getBookings: () => api.get("/api/admin/bookings"),
  updateBookingStatus: (id, status) => api.patch(`/api/admin/bookings/${id}/status`, { status }),
  acceptBooking: (id) => api.post(`/api/admin/bookings/${id}/accept`),
  rescheduleBooking: (id, data) => api.patch(`/api/admin/bookings/${id}/reschedule`, data),
  resendBookingEmail: (id) => api.post(`/api/admin/bookings/${id}/resend-email`),
  deleteBooking: (id) => api.delete(`/api/admin/bookings/${id}`),

  // SMTP settings
  getSmtpSettings: () => api.get("/api/admin/settings/smtp"),
  saveSmtpSettings: (data) => api.put("/api/admin/settings/smtp", data),
  testSmtpConnection: () => api.post("/api/admin/settings/smtp/test-connection"),
  sendSmtpTestEmail: (email) => api.post("/api/admin/settings/smtp/test-email", { email }),

  // Site content
  getAbout: () => api.get("/api/public/about"),
  getTerms: () => api.get("/api/public/terms"),
  updateTerms: (data) => api.put("/api/admin/terms", data),
  updateAbout: (data) => api.put("/api/admin/about", data),
  getContact: () => api.get("/api/public/contact"),
  updateContact: (data) => api.put("/api/admin/contact", data),
  getSocialLinks: () => api.get("/api/public/social-links"),
  updateSocialLinks: (data) => api.put("/api/admin/social-links", data),
};
