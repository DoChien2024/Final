export interface HelpDocument {
  id: string
  title: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface HelpDocumentFormData {
  title: string
  content: string
  status: 'active' | 'inactive'
}


