import { create } from 'zustand'

type ModalMode = 'create' | 'edit' | 'delete'

interface ModalState {
  isOpen: boolean
  mode: ModalMode
  selectedId: string | null
  selectedData: any
  open: (mode?: ModalMode, id?: string | null, data?: any) => void
  close: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  mode: 'create',
  selectedId: null,
  selectedData: null,
  open: (mode = 'create', id = null, data = null) => set({ isOpen: true, mode, selectedId: id, selectedData: data }),
  close: () => set({ isOpen: false, selectedId: null, selectedData: null }),
}))
