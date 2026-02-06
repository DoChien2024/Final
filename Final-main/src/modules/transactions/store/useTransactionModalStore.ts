import { create } from 'zustand'
import type { TransactionCategory } from '../constants'
import type { TransactionFormValues } from '../types'

export type TransactionMode = 'Debit' | 'Credit'

interface TransactionModalState {
  // Modal state
  isOpen: boolean
  category: TransactionCategory | null
  mode: TransactionMode | null // Quản lý mode hiện tại (Debit hoặc Credit)
  
  // Confirm page state
  showConfirm: boolean
  confirmData: TransactionFormValues | null
  confirmMode: 'draft' | 'submit' | null
  
  // Actions
  openModal: (category: TransactionCategory) => void
  closeModal: () => void
  setMode: (mode: TransactionMode) => void // Action để set mode
  openConfirm: (data: TransactionFormValues, mode: 'draft' | 'submit') => void
  closeConfirm: () => void
  reset: () => void
}

export const useTransactionModalStore = create<TransactionModalState>((set) => ({
  // Initial state
  isOpen: false,
  category: null,
  mode: null,
  showConfirm: false,
  confirmData: null,
  confirmMode: null,

  // Actions
  openModal: (category) => {
    const mode = category === 'debit' ? 'Debit' : 'Credit'
    set({ isOpen: true, category, mode })
  },
  closeModal: () => set({ 
    isOpen: false, 
    showConfirm: false, 
    confirmData: null, 
    confirmMode: null,
    mode: null 
  }),
  setMode: (mode) => set({ mode }),
  openConfirm: (data, mode) => set({ showConfirm: true, confirmData: data, confirmMode: mode }),
  closeConfirm: () => set({ showConfirm: false, confirmData: null, confirmMode: null }),
  reset: () => set({ 
    isOpen: false, 
    category: null, 
    mode: null,
    showConfirm: false, 
    confirmData: null, 
    confirmMode: null 
  }),
}))
