/**
 * Query Params Management Utilities
 * Quản lý query params cho search & pagination
 */

export interface QueryParamsConfig {
  defaultPageSize?: number
  defaultPageIndex?: number
  defaultSearch?: string
}

export interface ParsedQueryParams {
  pageIndex: number
  pageSize: number
  search: string
}

/**
 * Parse query params from URLSearchParams
 * Utility function để lấy và parse các giá trị từ URL
 * @param searchParams - URLSearchParams object from window.location.search
 * @param config - Configuration for default values
 * @returns Parsed and standardized query params object
 */
export const getQueryParams = (
  searchParams: URLSearchParams,
  config: QueryParamsConfig = {}
): ParsedQueryParams => {
  const { defaultPageSize = 10, defaultPageIndex = 1, defaultSearch = '' } = config

  const parseNumber = (key1: string, key2: string, defaultVal: number) => 
    Math.max(1, Number(searchParams.get(key1) || searchParams.get(key2)) || defaultVal)

  return {
    pageIndex: parseNumber('page', 'pageIndex', defaultPageIndex),
    pageSize: parseNumber('limit', 'pageSize', defaultPageSize),
    search: (searchParams.get('search') || defaultSearch).trim(),
  }
}

/**
 * Build query params object for API requests
 * Chuyển đổi từ pageIndex/pageSize sang offset/limit format
 * @param params - Parsed query params
 * @returns Object ready for API request with offset-based pagination
 */
export const buildApiQueryParams = (params: Partial<ParsedQueryParams> = {}) => {
  const { pageIndex = 1, pageSize = 10, search = '' } = params
  
  return {
    offset: (pageIndex - 1) * pageSize,
    limit: pageSize,
    ...(search?.trim() && { search: search.trim() }),
  }
}

/**
 * Parse paginated API response to extract items and metadata
 * @param response - API response object
 * @param fallbackPage - Fallback page number (default: 1)
 * @param fallbackLimit - Fallback limit number (default: 10)
 * @returns Parsed items array and metadata
 */
export const parsePaginatedResponse = <T>(response: any, fallbackPage: number = 1, fallbackLimit: number = 10) => {
  if (!response) return { items: [], total: 0, totalPages: 1, page: fallbackPage, limit: fallbackLimit }

  const { data, metadata } = response
  let items: T[] = []
  let meta: any = null

  if (Array.isArray(data)) {
    items = data
    meta = metadata
  } else if (data && typeof data === 'object') {
    if (Array.isArray(data.items)) {
      items = data.items
      meta = data
    } else if (Array.isArray(data.data)) {
      items = data.data
      meta = data.metadata || data
    }
  }

  return {
    items,
    total: meta?.totalCount || meta?.total || items.length,
    totalPages: meta?.totalPages || 1,
    page: meta?.page || fallbackPage,
    limit: meta?.limit || fallbackLimit,
  }
}
