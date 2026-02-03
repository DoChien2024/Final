import { create } from 'zustand'
import type { TransactionOptions } from '../types'
import { DEBIT_TRANSACTION_TYPES, CREDIT_TRANSACTION_TYPES, TRANSACTION_STATUSES } from '../constants'

interface TransactionOptionsState {
  // Transaction types and statuses
  transactionTypes: {
    debit: typeof DEBIT_TRANSACTION_TYPES
    credit: typeof CREDIT_TRANSACTION_TYPES
  }
  transactionStatuses: typeof TRANSACTION_STATUSES
  
  // API-fetched options
  options: TransactionOptions | null
  
  // Loading states
  isLoading: boolean
  
  // Actions
  setOptions: (options: TransactionOptions) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

const initialOptions: TransactionOptions = {
  orgs: [],
  subOrgs: [],
  currencies: [],
  bankAccounts: [],
}

export const useTransactionOptionsStore = create<TransactionOptionsState>((set) => ({
  // Initial state
  transactionTypes: {
    debit: DEBIT_TRANSACTION_TYPES,
    credit: CREDIT_TRANSACTION_TYPES,
  },
  transactionStatuses: TRANSACTION_STATUSES,
  options: null,
  isLoading: false,

  // Actions
  setOptions: (options) => set({ options }),
  setLoading: (loading) => set({ isLoading: loading }),
  reset: () => set({ options: initialOptions, isLoading: false }),
}))

// ==================== SELECTORS ====================

// Get transaction type options by category
export const getTransactionTypeOptions = (category: 'debit' | 'credit') => {
  const store = useTransactionOptionsStore.getState()
  const types = category === 'debit' ? store.transactionTypes.debit : store.transactionTypes.credit
  return types.map((t) => ({ label: t, value: t }))
}

// Get transaction status options
export const getTransactionStatusOptions = () => {
  const store = useTransactionOptionsStore.getState()
  return store.transactionStatuses.map((s) => ({ label: s, value: s }))
}
