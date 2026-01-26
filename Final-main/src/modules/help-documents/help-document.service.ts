import { API_ENDPOINTS } from '@/config'
import { createCrudService } from '@/services/base.service'
import type { HelpDocument, HelpDocumentFormData } from './help-document.types'

// Sử dụng generic CRUD service factory
const baseService = createCrudService<HelpDocument, HelpDocumentFormData>(API_ENDPOINTS.ADMIN_HELP_DOCUMENTS)

export const helpDocumentService = {
  getHelpDocuments: baseService.getAll,
  getHelpDocumentById: baseService.getById,
  createHelpDocument: baseService.create,
  updateHelpDocument: baseService.update,
  deleteHelpDocument: baseService.delete,
  bulkDeleteHelpDocuments: baseService.bulkDelete,
}


