// PD Session Types
export interface PDSession {
  id: string
  slug?: string
  title: string
  content?: string
  status: 'published' | 'unpublished'
  type: 'pd'
  author?: string | {
    id: string
    firstName?: string
    lastName?: string
    fullName?: string
  }
  categoryId?: string
  category?: {
    id: string
    name: string
  }
  timeToRead?: number
  index?: number
  references?: any
  isPublished?: boolean
  createdAt: string
  updatedAt: string
  picture?: {
    id: string
    uri: string
    type: string
    metadata?: any
  }
}

export interface PDSessionFormData {
  title: string
  author?: string
  content?: string
  categoryId?: string
  status: 'published' | 'unpublished' | 'draft'
  timeToRead?: number
  featuredImageId?: string
}


