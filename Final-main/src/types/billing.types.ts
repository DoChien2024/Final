// Billing History Types
export interface BillingHistory {
  id: string
  date: string
  amount: number
  status: 'success' | 'failed' | 'pending'
  invoiceUrl?: string
  subscriptionId?: string
  doulaId?: string
  createdAt: string
  updatedAt: string
}

export interface BillingHistoryParams {
  doulaId?: string
  subscriptionId?: string
  status?: string
  page?: number
  limit?: number
}
