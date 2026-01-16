import { STATUS_LABELS } from '../../config/constants'

/**
 * Get display text for status
 * @param status - Status key
 * @returns Display text for status
 */
export const getStatusDisplay = (status: string): string => {
  return STATUS_LABELS[status] || status
}

/**
 * Get color for status
 * @param status - Status key
 * @returns Hex color code for status
 */
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: '#28a745',
    inactive: '#6c757d',
    expired: '#dc3545',
  }
  return colors[status] || '#6c757d'
}

/**
 * Get full name from user object
 * @param user - User object with name fields
 * @returns Full name or '-' if not available
 */
export const getFullName = (user?: { fullName?: string; firstName?: string; middleName?: string; lastName?: string }): string => {
  if (!user) return '-'
  if (user.fullName) return user.fullName
  const parts = [user.firstName, user.middleName, user.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : '-'
}
