import { z } from 'zod'
import { TRANSACTION_TYPES, TRANSACTION_STATUSES } from '../constants'

const REQUIRED_MSG = 'This field is required'

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
    { message: 'Invalid transaction type' }
  ),

  status: z.enum(TRANSACTION_STATUSES, { message: REQUIRED_MSG }),

  clientName: z.string().optional(),
  subOrgName: z.string().optional(),
  transactionId: z.string().optional(),

  currency: z.string().min(1, REQUIRED_MSG),

  amount: z.coerce
    .number({ message: REQUIRED_MSG })
    .positive('Amount must be greater than 0'),

  fees: z.coerce.number().nullable().optional(),
  bankCharges: z.coerce.number().nullable().optional(),
  gstAmount: z.coerce.number().nullable().optional(),

  effectiveDate: z.coerce.date({ message: REQUIRED_MSG }),
  createdDate: z.coerce.date().optional(),

  bankAccount: z.string().min(1, REQUIRED_MSG),
  description: z.string().min(1, REQUIRED_MSG),

  supportingDocs: z.array(z.instanceof(File)).optional(),
  internalComments: z.string().optional(),
})
  .superRefine((data, ctx) => {
    // Validate effective date range
    const { minDate, maxDate } = getDateRange()
    
    if (data.effectiveDate < minDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['effectiveDate'],
        message: 'Date cannot be more than 3 months in the past',
      })
    }

    if (data.effectiveDate > maxDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['effectiveDate'],
        message: 'Date cannot be more than 3 months in the future',
      })
    }
  })

export type TransactionFormSchemaType = z.infer<typeof transactionFormSchema>
