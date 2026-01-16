import { API_ENDPOINTS } from '@/api/api'
import { createCrudService } from '@/services/base.service'
import axiosInstance from '@/utils/axios'
import type { Voucher, VoucherFormData } from './voucher.types'

// Sử dụng generic CRUD service factory
const baseService = createCrudService<Voucher, VoucherFormData>(API_ENDPOINTS.ADMIN_VOUCHERS)

export const voucherService = {
  getVouchers: baseService.getAll,
  getVoucherById: baseService.getById,
  createVoucher: baseService.create,
  updateVoucher: baseService.update,
  
  // Soft delete voucher - update status to inactive
  deleteVoucher: async (id: string) => {
    return axiosInstance.put(`${API_ENDPOINTS.ADMIN_VOUCHERS}/${id}`, {
      status: 'inactive'
    })
  },
  
  bulkDeleteVouchers: baseService.bulkDelete,
  
  // Get voucher usage history (doula-vouchers)
  getVoucherHistory: async (voucherId: string) => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN_DOULA_VOUCHERS, {
      params: {
        f_voucherId: voucherId,
        limit: 100,
      },
    })
    return response
  },
}

