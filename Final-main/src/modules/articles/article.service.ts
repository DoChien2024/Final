import axiosInstance from '@/utils/axios'
import { API_ENDPOINTS } from '@/api/api'
import { createCrudService } from '@/services/base.service'
import type { Article, ArticleFormData } from './article.types'

// Sử dụng generic CRUD service factory
const baseService = createCrudService<Article, ArticleFormData>(API_ENDPOINTS.ADMIN_ARTICLES)

export const articleService = {
  getArticles: baseService.getAll,
  getArticleById: baseService.getById,
  createArticle: baseService.create,
  updateArticle: baseService.update,
  
  // Custom delete - API cần ids array trong body
  deleteArticle: async (id: string) => {
    return axiosInstance.delete(API_ENDPOINTS.ADMIN_ARTICLES, {
      data: { ids: [id] }
    })
  },
}
