import { format } from 'date-fns'

/**
 * Format pagination information text
 * @param page - Current page number
 * @param limit - Items per page
 * @param total - Total number of items
 * @returns Formatted pagination text
 */
export const formatPaginationInfo = (page: number, limit: number, total: number): string => {
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  return `Showing ${from} to ${to} of ${total} entries.`
}

/**
 * Format date string to specified format
 * @param dateString - Date string to format
 * @param formatStr - Format pattern (default: 'dd/MM/yyyy')
 * @returns Formatted date string or '-' if invalid
 */
export const formatDate = (dateString: string | null | undefined, formatStr: string = 'dd/MM/yyyy'): string => {
  if (!dateString) return '-'
  try {
    return format(new Date(dateString), formatStr)
  } catch {
    return '-'
  }
}

/**
 * Format date string to datetime format
 * @param dateString - Date string to format
 * @returns Formatted datetime string
 */
export const formatDateTime = (dateString: string | null | undefined): string => {
  return formatDate(dateString, 'dd/MM/yyyy HH:mm')
}

/**
 * Format amount based on type
 * @param amount - Amount value
 * @param type - Type of formatting ('percentage' or 'fixed')
 * @returns Formatted amount string
 */
export const formatAmount = (amount: string | number, type: 'percentage' | 'fixed'): string => {
  return type === 'percentage' ? `${amount}%` : `$${amount}`
}
