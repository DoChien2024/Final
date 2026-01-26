/**
 * Article API - All API calls centralized
 */

import axiosInstance from '@/utils/axios'
import { API_ENDPOINTS } from '@/config'
import type { IArticleDetail } from '../article.types'
import type { ApiResponse, PaginatedResponse } from '@/types'
import type { ArticleFormData } from '../schema/article.schema'

interface ApiParams {
  page?: number
  limit?: number
  search?: string
  sort?: string
  f_type?: string
  embed?: string
}

export const articleApi = {
  // Get all articles with pagination
  getAll: async (params: ApiParams): Promise<ApiResponse<PaginatedResponse<IArticleDetail>>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<IArticleDetail>>>(
      API_ENDPOINTS.ADMIN_ARTICLES,
      { params }
    )
    return response.data
  },

  // Get single article by ID
  getById: async (id: string): Promise<ApiResponse<IArticleDetail>> => {
    const response = await axiosInstance.get<ApiResponse<IArticleDetail>>(
      `${API_ENDPOINTS.ADMIN_ARTICLES}/${id}`
    )
    return response.data
  },

  // Create new article
  create: async (data: ArticleFormData): Promise<ApiResponse<IArticleDetail>> => {
    const response = await axiosInstance.post<ApiResponse<IArticleDetail>>(
      API_ENDPOINTS.ADMIN_ARTICLES,
      data
    )
    return response.data
  },

  // Update existing article
  update: async (id: string, data: ArticleFormData): Promise<ApiResponse<IArticleDetail>> => {
    const response = await axiosInstance.put<ApiResponse<IArticleDetail>>(
      `${API_ENDPOINTS.ADMIN_ARTICLES}/${id}`,
      data
    )
    return response.data
  },

  // Delete article
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.ADMIN_ARTICLES, {
      data: { ids: [id] }
    })
  },
}
