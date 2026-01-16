// Settings Types
export interface Setting {
  id: string
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  description?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

export interface SettingFormData {
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'json'
  description?: string
  isPublic: boolean
}

// Trending Keywords (Search Settings) Types
export interface TrendingKeyword {
  id: string
  keyword: string
  count: number
  isSuggestion: boolean
  createdAt: string
  updatedAt: string
}

export interface TrendingKeywordFormData {
  keyword: string
  count?: number
  isSuggestion?: boolean
}


