import { useState, useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from './useParams'
import { useGetList } from './useGetList'
import { buildApiQueryParams, parsePaginatedResponse } from '@/utils'
import type { ApiResponse, PaginatedResponse, QueryParams } from '../types'

export interface FetchParams {
  page: number
  limit: number
  search: string
  sort: string
  order: 'asc' | 'desc'
}

export interface TableManagerOptions<T> {
  queryKey: string
  fetchFn: (params?: QueryParams) => Promise<ApiResponse<PaginatedResponse<T>>>
  deleteFn?: (id: number | string) => Promise<ApiResponse>
  defaultSortField?: string
  defaultSortOrder?: 'asc' | 'desc'
  defaultLimit?: number
}

export function useTableManager<T = unknown>(options: TableManagerOptions<T>) {
  const queryClient = useQueryClient()
  
  // Use useParams hook for URL parameter management
  const { params, updateParams: setParams } = useParams({
    page: 1,
    limit: options.defaultLimit || 10,
    search: '',
    sort: options.defaultSortField || 'createdAt',
    order: options.defaultSortOrder || 'desc',
  })

  const { page, limit, search, sort: sortField, order: sortOrder } = params

  const [searchInput, setSearchInput] = useState(search)
  const [sorting, setSorting] = useState([{ id: sortField, desc: sortOrder === 'desc' }])

  // Build API query params with safe defaults
  const queryParams: QueryParams = useMemo(() => ({
    ...buildApiQueryParams({ 
      pageIndex: page || 1, 
      pageSize: limit || 10, 
      search: search || '' 
    }),
    ...(sortField && { sort: sortOrder === 'desc' ? `-${sortField}` : sortField })
  }), [page, limit, search, sortField, sortOrder])

  // Fetch data using useGetList (2 parameters: queryParams, queryOptions)
  const { data: response, isLoading, error } = useGetList<T>(
    queryParams,
    {
      queryKey: options.queryKey,
      fetchFn: options.fetchFn,
      staleTime: 5000,
    }
  )
  
  // Parse response using helper function
  const data: PaginatedResponse<T> = useMemo(
    () => parsePaginatedResponse<T>(response, page, limit),
    [response, page, limit]
  )

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: options.deleteFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [options.queryKey] }),
  })

  // Update params to URL
  const updateParams = (newParams: Partial<FetchParams>) => {
    setParams({
      page: newParams.page ?? page,
      limit: newParams.limit ?? limit,
      search: newParams.search ?? search,
      sort: newParams.sort || sortField,
      order: newParams.order || sortOrder,
    })
  }

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateParams({ search: searchInput, page: 1 })
  }

  const handleSortChange = (columnId: string) => {
    // Check trạng thái sort hiện tại (True/False)
    const currentSort = sorting.find(s => s.id === columnId)
    const isDescending = currentSort?.desc || false
    
    // Flip sort order
    const newOrder = isDescending ? 'asc' : 'desc'
    
    // Update state
    setSorting([{ id: columnId, desc: !isDescending }])
    
    // Dùng Maps đẩy params lên URL
    updateParams({ sort: columnId, order: newOrder, page: 1 })
  }

  const handleDelete = async (id: number | string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return {
    page,
    limit,
    search,
    sortField,
    sortOrder,
    searchInput,
    setSearchInput,
    sorting,
    setSorting,
    data,
    response,
    isLoading,
    error,
    updateParams,
    handleSearch,
    handleSortChange,
    handleDelete,
    deleteMutation,
  }
}
