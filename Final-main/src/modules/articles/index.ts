/**
 * Articles Module - Barrel Export
 * Structure: api/, components/, hooks/, pages/, schema/
 */

// Main page export
export { default as ArticlePage } from './pages/ArticlePage'

// Legacy export for backward compatibility
export { default as Articles } from './pages/ArticlePage'

// API exports
export { articleApi } from './api/api'

// Type exports
export * from './article.types'

// Component exports (if needed externally)
export { default as ArticleModal } from './components/ArticleModal'
export { default as ArticleFormModal } from './components/ArticleFormModal'
export { default as ArticleDelete } from './components/ArticleDelete'
export { createArticlesColumns } from './components/ArticleColumns'

// Hook exports
export { useArticleFormMutations } from './hooks/useArticleFormMutations'

// Schema exports
export * from './schema/article.schema'
