import { API_ENDPOINTS } from '@/config'
import { createCrudService } from '@/services/base.service'
import axiosInstance from '@/utils/axios'
import type { Doula, DoulaFormData } from './doula.types'

// Sử dụng generic CRUD service factory
const baseService = createCrudService<Doula, DoulaFormData>(API_ENDPOINTS.ADMIN_DOULAS)

export const doulaService = {
  // GET /admins/doulas - Get all doulas with pagination
  getDoulas: baseService.getAll,
  
  // GET /admins/doulas/:id - Get doula by ID
  getDoulaById: baseService.getById,
  
  // POST /admins/doulas - Create new doula
  createDoula: baseService.create,
  
  // PUT /admins/doulas/:id - Update doula
  updateDoula: baseService.update,
  
  // DELETE /admins/doulas/:id - Delete doula
  deleteDoula: baseService.delete,
  
  // POST /admins/doulas/bulk-delete - Bulk delete doulas
  bulkDeleteDoulas: baseService.bulkDelete,
  
  // GET /admins/doula-subscriptions/:doulaId - Get doula subscription
  getDoulaSubscription: (doulaId: string) => 
    axiosInstance.get(`${API_ENDPOINTS.ADMIN_DOULA_SUBSCRIPTIONS}/${doulaId}`),
  
  // GET /admins/doula-packages?f_doulaId={id} - Get doula packages (use f_doulaId as filter param)
  getDoulaPackages: (doulaId: string) => 
    axiosInstance.get(`${API_ENDPOINTS.ADMIN_DOULA_PACKAGES}`, { params: { page: 1, limit: 25, f_doulaId: doulaId } }),
  
  // GET /admins/doula-packages/:id - Get package by ID
  getPackageById: (packageId: string) => 
    axiosInstance.get(`${API_ENDPOINTS.ADMIN_DOULA_PACKAGES}/${packageId}`),
  
  // GET /admins/transactions?f_doulaId={id} - Get doula transactions (use f_doulaId as filter param)
  getDoulaTransactions: (doulaId: string) => 
    axiosInstance.get(`${API_ENDPOINTS.ADMIN_TRANSACTIONS}`, { params: { page: 1, limit: 25, f_doulaId: doulaId } }),
}


