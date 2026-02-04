import type { FieldVisibility } from '../constants'

/**
 * Utility function to get bank label based on direction
 */
export const getBankLabel = (direction: FieldVisibility['bankDirection']): string => {
  switch (direction) {
    case 'from':
      return 'Bank Details (From)'
    case 'to':
      return 'Bank Details (To)'
    default:
      return 'Bank Account'
  }
}

/**
 * Format currency value with proper locale
 */
export const formatCurrency = (value: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Format number with thousand separators
 */
export const formatNumber = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '0.00'
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
