import axiosInstance from '@/utils/axios'
import type { ApiResponse } from '@/types/api.types'
import type { CashTransactionPayload } from '../types'

export const createCashTransaction = async (payload: CashTransactionPayload) => {
  const response = await axiosInstance.post<ApiResponse<any>>('/transactions/cash', payload)
  return response.data
}
