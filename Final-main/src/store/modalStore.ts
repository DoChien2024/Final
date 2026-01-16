import { create } from 'zustand'

type ModalMode = 'create' | 'edit'

interface ModalState {
  isOpen: boolean
  mode: ModalMode
  selectedId: string | null
  selectedData: any
  
  open: (mode?: ModalMode, id?: string | null, data?: any) => void
  close: () => void
  setMode: (mode: ModalMode) => void
  setSelectedId: (id: string | null) => void
  setSelectedData: (data: any) => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  mode: 'create',
  selectedId: null,
  selectedData: null,
  
  open: (mode = 'create', id = null, data = null) => set({ 
    isOpen: true, 
    mode,
    selectedId: id,
    selectedData: data
  }),
  
  close: () => set({ 
    isOpen: false, 
    selectedId: null,
    selectedData: null
  }),
  
  setMode: (mode) => set({ mode }),
  
  setSelectedId: (id) => set({ selectedId: id }),
  
  setSelectedData: (data) => set({ selectedData: data }),
}))
