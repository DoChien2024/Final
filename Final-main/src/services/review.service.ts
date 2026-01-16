import { API_ENDPOINTS } from '../api/api'
import { createCrudService } from './base.service'
import type { Review, ReviewFormData } from '../types'

// Sử dụng generic CRUD service factory
const baseService = createCrudService<Review, ReviewFormData>(API_ENDPOINTS.ADMIN_REVIEWS)

export const reviewService = {
  getReviews: baseService.getAll,
  getReviewById: baseService.getById,
  createReview: baseService.create,
  updateReview: baseService.update,
  deleteReview: baseService.delete,
  bulkDeleteReviews: baseService.bulkDelete,
}
