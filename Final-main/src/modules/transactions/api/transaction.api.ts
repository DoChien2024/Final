import axiosInstance from '@/utils/axios'
import type { ApiResponse } from '@/types/api.types'
import type { CashTransactionPayload } from '../types'

// Temporary mock for testing UI flow (remove when backend is ready)
const MOCK_API = true // Set to false when backend endpoint is ready

export const createCashTransaction = async (payload: CashTransactionPayload) => {
  if (MOCK_API) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Return mock success response
    return {
      success: true,
      data: {
        id: `MOCK_${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString()
      },
      message: 'Transaction created successfully (MOCK)'
    }
  }

  // Real API call
  const response = await axiosInstance.post<ApiResponse<any>>('/transactions/cash', payload)
  return response.data
}
