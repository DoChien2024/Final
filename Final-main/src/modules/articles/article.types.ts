import type { Media } from '@/types/media.types'

// Article Types
export interface Article {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  duration?: number
  timeToRead?: number
  status: 'draft' | 'published' | 'unpublished'
  type?: string
  featuredImage?: Media
  picture?: Media
  author?: string | {
    id?: string
    firstName?: string
    lastName?: string
    fullName?: string
  }
  category?: string | {
    id?: string
    name?: string
  }
  tags?: string[]
  viewCount?: number
  favoriteCount?: number
  isFavorite?: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ArticleFormData {
  title: string
  author?: string
  content?: string
  excerpt?: string
  categoryId?: string
  status: 'draft' | 'published' | 'unpublished'
  type?: string
  timeToRead?: number
  duration?: number
  featuredImageId?: string
}

