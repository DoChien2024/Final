import { useQuery } from '@tanstack/react-query'
import { fetchListIsin, fetchIsinHolding, fetchIsinDetail } from '../api'

// Hook để lấy danh sách ISIN
export const useGetListIsins = () => {
  return useQuery({
    queryKey: ['isins'],
    queryFn: fetchListIsin,
  })
}

// Hook để lấy ISIN Holding dựa theo ISIN
export const useGetIsinHolding = (isin?: string) => {
  return useQuery({
    queryKey: ['isinHolding', isin],
    queryFn: () => fetchIsinHolding(isin),
    enabled: !!isin,
  })
}

// Hook để lấy chi tiết ISIN
export const useGetIsinDetail = (isin?: string) => {
  return useQuery({
    queryKey: ['isinDetail', isin],
    queryFn: () => fetchIsinDetail(isin!),
    enabled: !!isin,
  })
}
