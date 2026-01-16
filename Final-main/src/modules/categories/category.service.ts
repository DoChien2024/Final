import axiosInstance from '@/utils/axios'
import { API_ENDPOINTS } from '@/api/api'
import { createCrudService } from '@/services/base.service'
import type { Category, CategoryFormData } from './category.types'

// Sử dụng generic CRUD service factory
const baseService = createCrudService<Category, CategoryFormData>(API_ENDPOINTS.ADMIN_CATEGORIES)

export const categoryService = {
  getCategories: baseService.getAll,
  getCategoryById: baseService.getById,
  createCategory: baseService.create,
  updateCategory: baseService.update,
  
  // Custom delete - API cần ids array trong body
  deleteCategory: async (id: string) => {
    return axiosInstance.delete(API_ENDPOINTS.ADMIN_CATEGORIES, {
      data: { ids: [id] }
    })
  },
}

