import { create } from 'zustand'
import type { TransactionCategory } from '../constants'

interface TransactionModalState {
  // Modal state
  isOpen: boolean
  category: TransactionCategory | null
  
  // Actions
  openModal: (category: TransactionCategory) => void
  closeModal: () => void
  reset: () => void
}

export const useTransactionModalStore = create<TransactionModalState>((set) => ({
  // Initial state
  isOpen: false,
  category: null,

  // Actions
  openModal: (category) => set({ isOpen: true, category }),
  closeModal: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false, category: null }),
}))
