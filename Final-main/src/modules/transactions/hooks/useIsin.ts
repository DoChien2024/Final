import { useQuery } from '@tanstack/react-query'
import { fetchListIsin, fetchIsinHolding } from '../api'

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

// Hook tổng hợp cho ISIN
export const useIsin = () => {
  const { data, isLoading } = useGetListIsins()

  return {
    useGetListIsins,
    useGetIsinHolding,
    isins: data?.data || [],
    isLoading,
  }
}
