import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types'

/**
 * Generic hook for fetching paginated list data
 * @param queryParams - Object chứa điều kiện lọc (page, limit, search, sort...)
 * @param queryOptions - Các cấu hình React Query (enabled, keepPreviousData, staleTime...)
 */
export function useGetList<T>(
  queryParams: QueryParams = {},
  queryOptions: Omit<
    UseQueryOptions<ApiResponse<PaginatedResponse<T>>, Error>,
    'queryKey' | 'queryFn'
  > & {
    queryKey: string | readonly unknown[]
    fetchFn: (params: QueryParams) => Promise<ApiResponse<PaginatedResponse<T>>>
  }
) {
  const { queryKey, fetchFn, ...reactQueryOptions } = queryOptions

  // Ensure safe defaults for queryParams on first load
  const safeQueryParams: QueryParams = {
    page: 1,
    limit: 10,
    ...queryParams,
  }

  return useQuery<ApiResponse<PaginatedResponse<T>>, Error>({
    queryKey: Array.isArray(queryKey) 
      ? [...queryKey, safeQueryParams]
      : [queryKey, safeQueryParams],
    queryFn: () => fetchFn(safeQueryParams),
    ...reactQueryOptions,
  })
}
