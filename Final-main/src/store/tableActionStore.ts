import { create } from 'zustand'

// Global singleton để store delete handler
let globalDeleteHandler: ((id: string) => void) | null = null

interface TableActionStore {
  setDeleteHandler: (handler: (id: string) => void) => void
  triggerDelete: (id: string) => void
}

export const useTableActionStore = create<TableActionStore>(() => ({
  setDeleteHandler: (handler) => {
    globalDeleteHandler = handler
  },
  
  triggerDelete: (id) => {
    if (globalDeleteHandler) {
      globalDeleteHandler(id)
    }
  },
}))
