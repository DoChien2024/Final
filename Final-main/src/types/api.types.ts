// API Response Types
export interface ApiResponse<T = any> {
  message: string
  data: T
  metadata?: {
    page: number
    limit: number
    totalPages: number
    totalCount: number
    hasNextPage?: boolean
    hasPrevPage?: boolean
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Query Parameters
export interface QueryParams {
  page?: number
  limit?: number
  offset?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  [key: string]: any
}
