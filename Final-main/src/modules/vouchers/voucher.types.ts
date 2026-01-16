// Voucher Types
export interface Voucher {
  id: string
  code: string
  description?: string
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'inactive'
  type: 'percentage' | 'fixed'
  amount: string | number
  quantityUse: number
  numOfUsed: string | number
  minPayAmount?: string | number
  maxDiscountAmount?: string | number
  stripeCouponId?: string | null
  createdBy?: string
  updatedBy?: string | null
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}

export interface VoucherFormData {
  code: string
  description?: string
  startDate: string
  endDate: string
  type: 'percentage' | 'fixed'
  amount: number
  quantityUse: number
  minPayAmount: number
  maxDiscountAmount: number
  status?: 'active' | 'inactive'
}

export interface VoucherHistoryItem {
  id: string
  doulaId: string
  voucherId: string
  status: string
  createdAt: string
  updatedAt: string
  doulaUser?: {
    id: string
    fullName?: string
    firstName?: string
    middleName?: string
    lastName?: string
  }
}
