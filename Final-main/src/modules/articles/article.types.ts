import type { Media } from '@/types/media.types'

// ========== SHARED TYPES ==========

export type ArticleStatus = 'draft' | 'published' | 'unpublished'

export interface ArticleAuthor {
  id: string
  firstName: string
  lastName: string
  fullName: string
}

export interface ArticleCategory {
  id: string
  name: string
}

// ========== API RESPONSE TYPES ==========

/** Article detail response - Full data from API */
export interface IArticleDetail {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  duration?: number
  timeToRead?: number
  status: ArticleStatus
  type?: string
  featuredImage?: Media
  picture?: Media
  author?: string | ArticleAuthor
  category?: string | ArticleCategory
  tags?: string[]
  viewCount?: number
  favoriteCount?: number
  isFavorite?: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

/** Article list item - Used in table/grid lists */
export interface IArticleListItem {
  id: string
  title: string
  slug: string
  status: ArticleStatus
  author?: string | ArticleAuthor
  category?: string | ArticleCategory
  duration?: number
  timeToRead?: number
  picture?: Media
  featuredImage?: Media
  viewCount?: number
  createdAt: string
  updatedAt: string
}

/** Article list response with pagination */
export interface IArticleList {
  items: IArticleListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ========== FORM TYPES ==========

/** Article form data - Used for both create & edit */
export interface IArticleForm {
  title: string
  author: string
  content: string
  status: ArticleStatus | ''
  categoryId: string
  duration: number | undefined
  featuredImageId: string
}

/** Article create request - Sent to API on create */
export interface IArticleCreateRequest {
  title: string
  author: string
  content: string
  status: ArticleStatus
  categoryId: string
  duration: number
  featuredImageId: string
}

/** Article update request - Sent to API on edit */
export interface IArticleUpdateRequest {
  title: string
  author: string
  content: string
  status: ArticleStatus
  categoryId: string
  duration: number
  featuredImageId?: string
}
