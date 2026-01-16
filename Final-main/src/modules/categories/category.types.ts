// Category Types
export interface Category {
  id: string
  name: string
  title?: string
  slug: string
  index?: number
  status: 'active' | 'inactive'
  picture?: {
    id: string
    uri: string
    type: string
    metadata?: any
  }
  createdAt: string
  updatedAt: string
}

export interface CategoryFormData {
  name: string
  title?: string
  status: 'active' | 'inactive' | ''
  image?: string
}

