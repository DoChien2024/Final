import axiosInstance from '@/utils/axios'
import type { BillingHistory, BillingHistoryParams } from '@/types/billing.types'
import type { ApiResponse } from '@/types/api.types'

export const billingService = {
  // GET /admins/billing-history hoặc /admins/transactions
  getBillingHistory: async (params?: BillingHistoryParams): Promise<ApiResponse<BillingHistory[]>> => {
    const response = await axiosInstance.get('/admins/billing-history', { params })
    return response.data
  },

  getBillingHistoryByDoula: async (doulaId: string): Promise<ApiResponse<BillingHistory[]>> => {
    const response = await axiosInstance.get(`/admins/billing-history`, { 
      params: { doulaId } 
    })
    return response.data
  },
}
