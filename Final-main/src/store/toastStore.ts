import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

interface ToastState {
  isVisible: boolean
  message: string
  type: ToastType
  showToast: (message: string, type?: ToastType) => void
  hideToast: () => void
}

export const useToastStore = create<ToastState>((set) => ({
  isVisible: false,
  message: '',
  type: 'success',

  showToast: (message, type = 'success') => {
    set({ isVisible: true, message, type })
    setTimeout(() => {
      set({ isVisible: false })
    }, 3000)
  },

  hideToast: () => set({ isVisible: false }),
}))
