import { create } from 'zustand'
import type { Doula } from '@/modules/doulas/doula.types'

type TabType = 'information' | 'subscription' | 'packages' | 'reviews'

interface DoulaState {
  activeTab: TabType
  selectedDoula: Doula | null
  isEditModalOpen: boolean
  
  // Actions
  setActiveTab: (tab: TabType) => void
  setSelectedDoula: (doula: Doula | null) => void
  openEditModal: () => void
  closeEditModal: () => void
  reset: () => void
}

const initialState = {
  activeTab: 'information' as TabType,
  selectedDoula: null,
  isEditModalOpen: false,
}

export const useDoulaStore = create<DoulaState>((set) => ({
  ...initialState,
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setSelectedDoula: (doula) => set({ selectedDoula: doula }),
  
  openEditModal: () => set({ isEditModalOpen: true }),
  
  closeEditModal: () => set({ isEditModalOpen: false }),
  
  reset: () => set(initialState),
}))
