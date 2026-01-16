import { API_ENDPOINTS } from '@/api/api'
import { createCrudService } from '@/services/base.service'
import type { Client, ClientFormData } from './client.types'

// Client service using generic CRUD service factory
const baseService = createCrudService<Client, ClientFormData>(API_ENDPOINTS.ADMIN_USERS)

export const clientService = {
  // GET /admins/users - Get all clients with pagination
  getClients: baseService.getAll,
  
  // GET /admins/users/:id - Get client by ID
  getClientById: baseService.getById,
  
  // POST /admins/users - Create new client
  createClient: baseService.create,
  
  // PUT /admins/users/:id - Update client
  updateClient: baseService.update,
  
  // DELETE /admins/users/:id - Delete client
  deleteClient: baseService.delete,
  
  // POST /admins/users/bulk-delete - Bulk delete clients
  bulkDeleteClients: baseService.bulkDelete,
}
