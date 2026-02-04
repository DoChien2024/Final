import { z } from 'zod'
import { TRANSACTION_TYPES, TRANSACTION_STATUSES, getTransactionConfig } from '../constants'
import { REQUIRED_MSG } from '@/utils/validationSchemas'

// Tính min/max date (3 tháng)
const getDateRange = () => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const minDate = new Date(today)
  minDate.setMonth(today.getMonth() - 3)
  
  const maxDate = new Date(today)
  maxDate.setMonth(today.getMonth() + 3)
  
  return { minDate, maxDate }
}

export const { minDate, maxDate } = getDateRange()

// Create Transaction Schema
export const transactionFormSchema = z.object({
  transactionType: z.string().min(1, REQUIRED_MSG).refine(
    (val) => TRANSACTION_TYPES.includes(val as any),
    { message: REQUIRED_MSG }
  ),

  status: z.union([
    z.enum(TRANSACTION_STATUSES),
    z.literal('')
  ]).refine((val) => val !== '', { message: REQUIRED_MSG }),

  clientName: z.string().optional(),
  subOrgName: z.string().optional(),
  transactionId: z.string().optional(),

  currency: z.string().min(1, REQUIRED_MSG),

  amount: z.coerce.number().nullable().optional(),

  fees: z.coerce.number().nullable().optional(),
  bankCharges: z.coerce.number().nullable().optional(),
  gstAmount: z.coerce.number().nullable().optional(),

  effectiveDate: z.coerce.date({ message: REQUIRED_MSG }),
  createdDate: z.coerce.date().optional(),

  bankAccount: z.string().optional(),
  description: z.string().min(1, REQUIRED_MSG),
  
  // Store bank options count for conditional validation
  _hasBankOptions: z.boolean().optional(),

  supportingDocs: z.array(z.instanceof(File)).optional(),
  internalComments: z.string().optional(),

  // Coupon Payment fields (only for Coupon Payment type)
  isin: z.string().optional(),
  securityName: z.string().optional(),
  couponPercentageRate: z.coerce.number().nullable().optional(),
  paymentDate: z.coerce.date().optional(),
  couponPayments: z.array(z.object({
    clientName: z.string().optional(),
    organizationNum: z.string().optional(),
    subOrganizationNum: z.string().optional(),
    subAccountNum: z.string().nullable().optional(),
    effectiveValueAmt: z.number().optional(),
    cashOrderAmt: z.coerce.number().nullable().optional(),
    currency: z.string().optional(),
    bankAccountTo: z.string().optional(),
  })).optional(),
  totalCouponAmount: z.number().optional(),
})
  .superRefine((data, ctx) => {
    // Get field visibility config based on transaction type
    const config = getTransactionConfig(data.transactionType)
    
    // Helper: Add validation error
    const addError = (path: string | (string | number)[], message: string) => {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: Array.isArray(path) ? path : [path],
        message,
      })
    }

    // Helper: Validate required field
    const validateRequired = (field: string, value: any) => {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        addError(field, REQUIRED_MSG)
        return false
      }
      return true
    }

    // Helper: Validate positive number
    const validatePositiveNumber = (field: string, value: number | null | undefined, label: string) => {
      if (value !== null && value !== undefined && value < 0) {
        addError(field, `${label} must be a positive number`)
      }
    }

    // 1. Validate effective date range
    const { minDate, maxDate } = getDateRange()
    if (data.effectiveDate < minDate || data.effectiveDate > maxDate) {
      addError('effectiveDate', REQUIRED_MSG)
    }

    // 2. Client Name validation - required when showClientFields is true
    if (config.showClientFields) {
      validateRequired('clientName', data.clientName)
    }

    // 3. Amount validation - only required for non-Coupon Payment types
    if (data.transactionType !== 'Coupon Payment') {
      if (!data.amount || data.amount <= 0) {
        addError('amount', REQUIRED_MSG)
      }
    }

    // 4. Optional numeric fields validation
    if (config.showFees) validatePositiveNumber('fees', data.fees, 'Fees')
    if (config.showBankCharges) validatePositiveNumber('bankCharges', data.bankCharges, 'Bank charges')
    if (config.showGstAmount) validatePositiveNumber('gstAmount', data.gstAmount, 'GST amount')

    // 5. Bank Account validation - only if there are bank options available
    if (data.transactionType !== 'Coupon Payment' && data._hasBankOptions) {
      validateRequired('bankAccount', data.bankAccount)
    }

    // 6. Coupon Payment specific validation
    if (data.transactionType === 'Coupon Payment') {
      // Required fields
      validateRequired('isin', data.isin)
      validateRequired('paymentDate', data.paymentDate)

      // Coupon rate validation
      if (!data.couponPercentageRate || data.couponPercentageRate <= 0) {
        addError('couponPercentageRate', REQUIRED_MSG)
      }

      // Coupon payments validation
      if (!data.couponPayments || data.couponPayments.length === 0) {
        addError('couponPayments', REQUIRED_MSG)
      } else {
        // Validate each payment row
        data.couponPayments.forEach((payment, index) => {
          if (!payment.bankAccountTo) {
            addError(['couponPayments', index, 'bankAccountTo'], REQUIRED_MSG)
          }
          if (!payment.cashOrderAmt || payment.cashOrderAmt <= 0) {
            addError(['couponPayments', index, 'cashOrderAmt'], REQUIRED_MSG)
          }
        })
      }
    }
  })

export type TransactionFormSchemaType = z.infer<typeof transactionFormSchema>
