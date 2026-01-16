import axiosInstance from '../utils/axios'
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types'

/**
 * Generic CRUD Service Factory
 * Tạo service với các phương thức CRUD cơ bản cho bất kỳ resource nào
 */
export function createCrudService<T, TFormData = Partial<T>>(baseEndpoint: string) {
  return {
    /**
     * Get all items with pagination, search, sort, filter
     */
    async getAll(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<T>>> {
      return axiosInstance.get(baseEndpoint, { params })
    },

    /**
     * Get single item by ID
     */
    async getById(id: number | string): Promise<ApiResponse<T>> {
      return axiosInstance.get(`${baseEndpoint}/${id}`)
    },

    /**
     * Create new item
     */
    async create(data: TFormData): Promise<ApiResponse<T>> {
      return axiosInstance.post(baseEndpoint, data)
    },

    /**
     * Update existing item
     */
    async update(id: number | string, data: Partial<TFormData>): Promise<ApiResponse<T>> {
      return axiosInstance.put(`${baseEndpoint}/${id}`, data)
    },

    /**
     * Delete item
     */
    async delete(id: number | string): Promise<ApiResponse> {
      return axiosInstance.delete(`${baseEndpoint}/${id}`)
    },

    /**
     * Bulk delete items
     */
    async bulkDelete(ids: string[]): Promise<ApiResponse> {
      return axiosInstance.post(`${baseEndpoint}/bulk-delete`, { ids })
    },
  }
}

/**
 * Generic method để tạo custom endpoint functions
 */
export function createEndpointGetter(base: string) {
  return {
    base,
    byId: (id: string) => `${base}/${id}`,
    custom: (path: string) => `${base}${path}`,
  }
}
