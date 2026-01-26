// ==================== TRANSACTION TYPES ====================

export const DEBIT_TRANSACTION_TYPES = [
  'Debit (Others)',
  'Fee',
  'Tax Withholding',
  'Withdrawal',
] as const

export const CREDIT_TRANSACTION_TYPES = [
  'Coupon Payment',
  'Credit (Others)',
  'Deposit',
] as const

export const TRANSACTION_TYPES = [
  ...DEBIT_TRANSACTION_TYPES,
  ...CREDIT_TRANSACTION_TYPES,
] as const

export const TRANSACTION_STATUSES = ['Draft', 'Pending', 'Complete'] as const


export type DebitTransactionType = (typeof DEBIT_TRANSACTION_TYPES)[number]
export type CreditTransactionType = (typeof CREDIT_TRANSACTION_TYPES)[number]
export type TransactionType = (typeof TRANSACTION_TYPES)[number]
export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number]
export type TransactionCategory = 'debit' | 'credit'

// ==================== FIELD VISIBILITY CONFIG ====================

export interface FieldVisibility {
  showClientFields: boolean
  showFees: boolean
  showBankCharges: boolean
  showGstAmount: boolean
  bankDirection: 'from' | 'to' | null
  descriptionAutoFill: string
  descriptionEditable: boolean
}

// Config cho từng transaction type
export const TRANSACTION_FIELD_CONFIG: Record<TransactionType, FieldVisibility> = {
  // DEBIT
  'Fee': {
    showClientFields: true,
    showFees: false,
    showBankCharges: false,
    showGstAmount: false,
    bankDirection: 'from',
    descriptionAutoFill: 'Fees',
    descriptionEditable: false,
  },
  'Tax Withholding': {
    showClientFields: true,
    showFees: false,
    showBankCharges: false,
    showGstAmount: false,
    bankDirection: 'from',
    descriptionAutoFill: 'Tax Withholding',
    descriptionEditable: false,
  },
  'Debit (Others)': {
    showClientFields: true,
    showFees: true,
    showBankCharges: true,
    showGstAmount: false,
    bankDirection: 'from',
    descriptionAutoFill: '',
    descriptionEditable: true,
  },
  'Withdrawal': {
    showClientFields: true,
    showFees: true,
    showBankCharges: true,
    showGstAmount: true,
    bankDirection: 'from',
    descriptionAutoFill: 'Withdrawal',
    descriptionEditable: false,
  },
  // CREDIT
  'Coupon Payment': {
    showClientFields: true,
    showFees: false,
    showBankCharges: false,
    showGstAmount: false,
    bankDirection: 'to',
    descriptionAutoFill: 'Coupon Payment',
    descriptionEditable: false,
  },
  'Credit (Others)': {
    showClientFields: true,
    showFees: false,
    showBankCharges: false,
    showGstAmount: false,
    bankDirection: 'to',
    descriptionAutoFill: '',
    descriptionEditable: true,
  },
  'Deposit': {
    showClientFields: true,
    showFees: true,
    showBankCharges: true,
    showGstAmount: false,
    bankDirection: 'to',
    descriptionAutoFill: 'Deposit',
    descriptionEditable: false,
  },
}

// ==================== STATUS COLORS ====================

export const STATUS_COLORS: Record<TransactionStatus, string> = {
  Draft: '#2563eb',    
  Pending: '#f97316',   
  Complete: '#22c55e',  
}
