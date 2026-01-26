import axiosInstance from '@/utils/axios'
import { API_ENDPOINTS } from '@/config'
import { createCrudService } from '@/services/base.service'
import type { PDSession, PDSessionFormData } from './pd-session.types'

// Sử dụng generic CRUD service factory - PD Sessions dùng chung endpoint với Articles
const baseService = createCrudService<PDSession, PDSessionFormData>(API_ENDPOINTS.ADMIN_ARTICLES)

export const pdSessionService = {
  getPDSessions: baseService.getAll,
  getPDSessionById: baseService.getById,
  createPDSession: baseService.create,
  updatePDSession: baseService.update,
  
  // Custom delete - API cần ids array trong body
  deletePDSession: async (id: string) => {
    return axiosInstance.delete(API_ENDPOINTS.ADMIN_ARTICLES, {
      data: { ids: [id] }
    })
  },
}


