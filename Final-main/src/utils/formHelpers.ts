/**
 * Form Helper Utilities
 * Shared helper functions for form data manipulation
 */

/**
 * Strip HTML tags from a string
 * @param html - HTML string to strip
 * @returns Plain text without HTML tags
 */
export const stripHtmlTags = (html: string): string => {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

/**
 * Parse author data - handle both string and object formats
 * @param author - Author data (string or object)
 * @returns Author name as string
 */
export const parseAuthor = (
  author?: string | { id?: string; firstName?: string; lastName?: string; fullName?: string }
): string => {
  if (!author) return ''
  if (typeof author === 'string') return author
  return author.fullName || author.firstName || ''
}

/**
 * Parse category data - handle both string and object formats
 * @param category - Category data (string or object)
 * @returns Category ID as string
 */
export const parseCategory = (
  category?: string | { id?: string; name?: string }
): string => {
  if (!category) return ''
  if (typeof category === 'string') return category
  return category.id || ''
}

/**
 * Parse categories data from API response
 * Handles different response formats (array, paginated object, etc.)
 * @param categoriesData - API response data
 * @returns Array of categories
 */
export const parseCategoriesData = (categoriesData: any): any[] => {
  if (!categoriesData) return []
  
  // If it's axios response object with .data property
  const apiData = categoriesData.data || categoriesData
  
  if (!apiData?.data) return []
  
  if (Array.isArray(apiData.data)) {
    return apiData.data
  }
  
  return apiData.data.items || []
}
