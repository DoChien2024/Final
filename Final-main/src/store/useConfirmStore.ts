import { create } from 'zustand'

interface ConfirmDialogState {
  isOpen: boolean
  title: string
  message: string
  confirmText: string
  cancelText: string
  variant: 'default' | 'danger'
  isLoading: boolean
  onConfirm: () => void
}

interface ConfirmDialogStore extends ConfirmDialogState {
  showConfirm: (options: Partial<Omit<ConfirmDialogState, 'isOpen' | 'isLoading'>>) => void
  hideConfirm: () => void
  confirmDelete: (onConfirm: () => void, itemName?: string) => void
  confirmCreate: (onConfirm: () => void, itemName?: string) => void
  confirmUpdate: (onConfirm: () => void, itemName?: string) => void
  confirmAction: (onConfirm: () => void, customMessage?: string) => void
  setLoading: (loading: boolean) => void
}

const defaultState: ConfirmDialogState = {
  isOpen: false,
  title: 'Confirm action',
  message: 'Do you want to perform this action?',
  confirmText: 'Submit',
  cancelText: 'Cancel',
  variant: 'default',
  isLoading: false,
  onConfirm: () => {},
}

export const useConfirmStore = create<ConfirmDialogStore>((set) => ({
  ...defaultState,

  showConfirm: (options) => {
    set({
      ...defaultState,
      ...options,
      isOpen: true,
      isLoading: false,
    })
  },

  hideConfirm: () => {
    set({ isOpen: false })
  },

  confirmDelete: (onConfirm, itemName = 'this item') => {
    set({
      ...defaultState,
      title: 'Delete Admin ?',
      message: `Are you sure you want to delete ${itemName}?`,
      confirmText: 'Submit',
      cancelText: 'Cancel',
      variant: 'danger',
      isOpen: true,
      isLoading: false,
      onConfirm,
    })
  },

  confirmCreate: (onConfirm, itemName = 'this item') => {
    set({
      ...defaultState,
      title: 'Confirm Create',
      message: `Are you sure you want to create ${itemName}?`,
      confirmText: 'Create',
      cancelText: 'Cancel',
      variant: 'default',
      isOpen: true,
      isLoading: false,
      onConfirm,
    })
  },

  confirmUpdate: (onConfirm, itemName = 'this item') => {
    set({
      ...defaultState,
      title: 'Confirm Update',
      message: `Are you sure you want to update ${itemName}?`,
      confirmText: 'Update',
      cancelText: 'Cancel',
      variant: 'default',
      isOpen: true,
      isLoading: false,
      onConfirm,
    })
  },

  confirmAction: (onConfirm, customMessage) => {
    set({
      ...defaultState,
      message: customMessage || defaultState.message,
      isOpen: true,
      isLoading: false,
      onConfirm,
    })
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },
}))
