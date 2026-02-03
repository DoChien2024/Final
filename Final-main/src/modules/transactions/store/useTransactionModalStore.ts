import { create } from 'zustand'
import type { TransactionCategory } from '../constants'
import type { TransactionFormValues } from '../types'

interface TransactionModalState {
  // Modal state
  isOpen: boolean
  category: TransactionCategory | null
  
  // Confirm page state
  showConfirm: boolean
  confirmData: TransactionFormValues | null
  confirmMode: 'draft' | 'submit' | null
  
  // Actions
  openModal: (category: TransactionCategory) => void
  closeModal: () => void
  openConfirm: (data: TransactionFormValues, mode: 'draft' | 'submit') => void
  closeConfirm: () => void
  reset: () => void
}

export const useTransactionModalStore = create<TransactionModalState>((set) => ({
  // Initial state
  isOpen: false,
  category: null,
  showConfirm: false,
  confirmData: null,
  confirmMode: null,

  // Actions
  openModal: (category) => set({ isOpen: true, category }),
  closeModal: () => set({ isOpen: false, showConfirm: false, confirmData: null, confirmMode: null }),
  openConfirm: (data, mode) => set({ showConfirm: true, confirmData: data, confirmMode: mode }),
  closeConfirm: () => set({ showConfirm: false, confirmData: null, confirmMode: null }),
  reset: () => set({ isOpen: false, category: null, showConfirm: false, confirmData: null, confirmMode: null }),
}))
