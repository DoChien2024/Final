import { API_ENDPOINTS } from '@/api/api'
import { createCrudService } from '@/services/base.service'
import type { User, UserFormData, AdminUser } from './user.types'
import type { AdminUserFormData } from '@/utils/validationSchemas'

// Admin Users service (for Admin Management page - /admins/admins endpoint)
const adminBaseService = createCrudService<AdminUser, AdminUserFormData>(API_ENDPOINTS.ADMIN_ADMINS)

export const adminUserService = {
  getAdmins: adminBaseService.getAll,
  getAdminById: adminBaseService.getById,
  createAdmin: adminBaseService.create,
  updateAdmin: adminBaseService.update,
  deleteAdmin: adminBaseService.delete,
  bulkDeleteAdmins: adminBaseService.bulkDelete,
}

// Regular Users service (for Client/Doula Management - /admins/users endpoint)
const baseService = createCrudService<User, UserFormData>(API_ENDPOINTS.ADMIN_USERS)

export const userService = {
  getUsers: baseService.getAll,
  getUserById: baseService.getById,
  createUser: baseService.create,
  updateUser: baseService.update,
  deleteUser: baseService.delete,
  bulkDeleteUsers: baseService.bulkDelete,
}

