import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LayoutState {
  expandedMenus: { [key: string]: boolean }
  showUserMenu: boolean
  showChangePasswordModal: boolean
  
  toggleMenu: (key: string) => void
  setShowUserMenu: (show: boolean) => void
  setShowChangePasswordModal: (show: boolean) => void
  closeAllMenus: () => void
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      expandedMenus: { accounts: true },
      showUserMenu: false,
      showChangePasswordModal: false,

      toggleMenu: (key) =>
        set((state) => ({
          expandedMenus: {
            ...state.expandedMenus,
            [key]: !state.expandedMenus[key],
          },
        })),

      setShowUserMenu: (show) => set({ showUserMenu: show }),

      setShowChangePasswordModal: (show) => set({ showChangePasswordModal: show }),

      closeAllMenus: () => set({ showUserMenu: false }),
    }),
    {
      name: 'layout-storage',
      partialize: (state) => ({
        expandedMenus: state.expandedMenus,
      }),
    }
  )
)
