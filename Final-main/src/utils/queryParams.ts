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
 * Backend expects: page, limit, search, sort
 * @param params - Parsed query params
 * @returns Object ready for API request with page-based pagination
 */
export const buildApiQueryParams = (params: Partial<ParsedQueryParams> = {}) => {
  const { pageIndex = 1, pageSize = 10, search = '' } = params
  
  return {
    page: pageIndex,
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

  let items: T[] = []
  let meta: any = null

  // Backend response structure: {message: "Success", data: [...], metadata: {page, limit, totalPages, totalCount}}
  if (response.data && Array.isArray(response.data)) {
    items = response.data
    meta = response.metadata || null
  } 
  // Fallback: data has items property
  else if (response.data && typeof response.data === 'object') {
    if (Array.isArray(response.data.items)) {
      items = response.data.items
      meta = response.data
    } else if (Array.isArray(response.data.data)) {
      items = response.data.data
      meta = response.data.metadata || response.data
    }
  }
  // Direct array (unlikely)
  else if (Array.isArray(response)) {
    items = response
    meta = null
  }

  const totalCount = meta?.totalCount || meta?.total || items.length
  const currentLimit = meta?.limit || fallbackLimit
  const calculatedTotalPages = Math.ceil(totalCount / currentLimit)

  const result = {
    items,
    total: totalCount,
    totalPages: meta?.totalPages || calculatedTotalPages,
    page: meta?.page || fallbackPage,
    limit: currentLimit,
  }

  return result
}
