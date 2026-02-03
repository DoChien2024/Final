import { z } from 'zod'
import { TRANSACTION_TYPES, TRANSACTION_STATUSES } from '../constants'
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

  amount: z.coerce
    .number({ message: REQUIRED_MSG })
    .positive(REQUIRED_MSG),

  fees: z.coerce.number().nullable().optional(),
  bankCharges: z.coerce.number().nullable().optional(),
  gstAmount: z.coerce.number().nullable().optional(),

  effectiveDate: z.coerce.date({ message: REQUIRED_MSG }),
  createdDate: z.coerce.date().optional(),

  bankAccount: z.string().min(1, REQUIRED_MSG),
  description: z.string().min(1, REQUIRED_MSG),

  supportingDocs: z.array(z.instanceof(File)).optional(),
  internalComments: z.string().optional(),

  // Coupon Payment fields (only for Coupon Payment type)
  isin: z.string().optional(),
  securityName: z.string().optional(),
  couponPercentageRate: z.coerce.number().nullable().optional(),
  paymentDate: z.coerce.date().optional(),
  couponPayments: z.array(z.object({
    clientName: z.string(),
    organizationNum: z.string(),
    subOrganizationNum: z.string(),
    subAccountNum: z.string().nullable(),
    effectiveValueAmt: z.number(),
    cashOrderAmt: z.number(),
    currency: z.string(),
    bankAccountTo: z.string(),
  })).optional(),
  totalCouponAmount: z.number().optional(),
})
  .superRefine((data, ctx) => {
    // Validate effective date range
    const { minDate, maxDate } = getDateRange()
    
    if (data.effectiveDate < minDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['effectiveDate'],
        message: REQUIRED_MSG,
      })
    }

    if (data.effectiveDate > maxDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['effectiveDate'],
        message: REQUIRED_MSG,
      })
    }

    // Coupon Payment specific validation (only when type is Coupon Payment)
    if (data.transactionType === 'Coupon Payment') {
      // Required fields for Coupon Payment
      const couponRequiredFields = [
        { field: 'isin', value: data.isin, message: REQUIRED_MSG },
        { field: 'paymentDate', value: data.paymentDate, message: REQUIRED_MSG },
      ] as const

      couponRequiredFields.forEach(({ field, value, message }) => {
        if (!value) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field],
            message,
          })
        }
      })

      // Coupon rate validation
      if (!data.couponPercentageRate || data.couponPercentageRate <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['couponPercentageRate'],
          message: REQUIRED_MSG,
        })
      }

      // Coupon payments validation
      if (!data.couponPayments || data.couponPayments.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['couponPayments'],
          message: REQUIRED_MSG,
        })
      } else {
        // Validate each payment row
        data.couponPayments.forEach((payment, index) => {
          if (!payment.bankAccountTo) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['couponPayments', index, 'bankAccountTo'],
              message: REQUIRED_MSG,
            })
          }
          if (!payment.cashOrderAmt || payment.cashOrderAmt <= 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['couponPayments', index, 'cashOrderAmt'],
              message: REQUIRED_MSG,
            })
          }
        })
      }
    }
  })

export type TransactionFormSchemaType = z.infer<typeof transactionFormSchema>
