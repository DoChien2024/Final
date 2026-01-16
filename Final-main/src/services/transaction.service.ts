import axiosInstance from '@/utils/axios'
import type { ApiResponse } from '@/types/api.types'

export interface Transaction {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  type: 'payment' | 'refund' | 'payout'
  description?: string
  userId?: string
  doulaId?: string
  subscriptionId?: string
  createdAt: string
  updatedAt: string
}

export interface TransactionParams {
  page?: number
  limit?: number
  sortBy?: string
  order?: 'asc' | 'desc'
  userId?: string
  doulaId?: string
  status?: string
  type?: string
}

export const transactionService = {
  // GET /admins/transactions
  getTransactions: async (params?: TransactionParams): Promise<ApiResponse<Transaction[]>> => {
    const response = await axiosInstance.get('/admins/transactions', { params })
    return response.data
  },

  // GET /admins/transactions/:id
  getTransactionById: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await axiosInstance.get(`/admins/transactions/${id}`)
    return response.data
  },
}
