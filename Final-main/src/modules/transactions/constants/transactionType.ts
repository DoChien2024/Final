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
// 1. DEFAULT CONFIG
const DEFAULT_CONFIG: FieldVisibility = {
  showClientFields: true,
  showFees: false,
  showBankCharges: false,
  showGstAmount: false,
  bankDirection: null,
  descriptionAutoFill: '',
  descriptionEditable: false,
}

const DEBIT_BASE: Partial<FieldVisibility> = { bankDirection: 'from' }
const CREDIT_BASE: Partial<FieldVisibility> = { bankDirection: 'to' }

const createConfig = (
  groupBase: Partial<FieldVisibility>,
  overrides: Partial<FieldVisibility> = {}
): FieldVisibility => {
  return { ...DEFAULT_CONFIG, ...groupBase, ...overrides }
}
//FINAL CONFIG MAP
export const TRANSACTION_FIELD_CONFIG: Record<TransactionType, FieldVisibility> = {
  // --- DEBIT GROUP ---
  'Fee': createConfig(DEBIT_BASE, {
    showFees: false,
    showBankCharges: false,
    descriptionAutoFill: 'Fees',
  }),

  'Tax Withholding': createConfig(DEBIT_BASE, {
    showFees: false,
    showBankCharges: false,
    descriptionAutoFill: 'Tax Withholding',
  }),

  'Debit (Others)': createConfig(DEBIT_BASE, {
    showFees: false,
    showBankCharges: false,
    descriptionAutoFill: '',
    descriptionEditable: true,
  }),

  'Withdrawal': createConfig(DEBIT_BASE, {
    showFees: true,
    showBankCharges: true,
    showGstAmount: true,
    descriptionAutoFill: 'Withdrawal',
  }),

  // --- CREDIT GROUP ---
  'Coupon Payment': createConfig(CREDIT_BASE, {
    showClientFields: false,
    showFees: false,
    showBankCharges: false,
    descriptionAutoFill: 'Coupon Payment',
  }),

  'Credit (Others)': createConfig(CREDIT_BASE, {
    showFees: false,
    showBankCharges: false,
    descriptionAutoFill: '',
    descriptionEditable: true,
  }),

  'Deposit': createConfig(CREDIT_BASE, {
    showFees: true,
    showBankCharges: true,
    descriptionAutoFill: 'Deposit',
  }),
}
// ==================== UTILITY HELPERS====================
export const getTransactionConfig = (type: string | undefined): FieldVisibility => {
  if (!type || !TRANSACTION_FIELD_CONFIG[type as TransactionType]) {
    return DEFAULT_CONFIG
  }
  return TRANSACTION_FIELD_CONFIG[type as TransactionType]
}
/*Kiểm tra xem có cần hiện Fees field*/
export const shouldShowFee = (type: string): boolean => {
  return getTransactionConfig(type).showFees
}
/*Kiểm tra xem có cần hiện GST field*/
export const shouldShowGst = (type: string): boolean => {
  return getTransactionConfig(type).showGstAmount
}

export const STATUS_COLORS: Record<TransactionStatus, string> = {
  Draft: '#2563eb',
  Pending: '#f97316',
  Complete: '#22c55e',
}