import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'
import { getQueryParams, buildApiQueryParams, QueryParamsConfig, ParsedQueryParams } from '@/utils'

export interface UseQueryParamsReturn {
  // Parsed params
  queryParams: ParsedQueryParams
  // API-ready params with offset/limit
  apiParams: ReturnType<typeof buildApiQueryParams>
  // Raw URLSearchParams for custom usage
  searchParams: URLSearchParams
  // Setter for updating URL
  setSearchParams: (params: URLSearchParams | Record<string, string>) => void
}

/**
 * Hook để quản lý query params từ URL
 * Sử dụng utility functions để parse và build params
 * 
 * @param config - Configuration for default values
 * @returns Object containing parsed params, API params, and setters
 * 
 * @example
 * 
 */
export const useQueryParams = (config?: QueryParamsConfig): UseQueryParamsReturn => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse query params using utility function
  const queryParams = useMemo(
    () => getQueryParams(searchParams, config),
    [searchParams, config]
  )

  // Build API params using utility function
  const apiParams = useMemo(
    () => buildApiQueryParams(queryParams),
    [queryParams]
  )

  return {
    queryParams,
    apiParams,
    searchParams,
    setSearchParams,
  }
}
