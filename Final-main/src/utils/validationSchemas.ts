import { z } from 'zod'

// ========== COMMON VALIDATION SCHEMAS ==========

const REQUIRED_MSG = 'This field is required.'
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MIN_MSG = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`

export const emailSchema = z
  .string()
  .min(1, REQUIRED_MSG)
  .email('Invalid email address.')

export const passwordSchema = z
  .string()
  .min(1, REQUIRED_MSG)
  .min(PASSWORD_MIN_LENGTH, PASSWORD_MIN_MSG)

export const optionalPasswordSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine((val) => !val || val.length >= PASSWORD_MIN_LENGTH, {
    message: PASSWORD_MIN_MSG,
  })

export const statusSchema = z.enum(['active', 'inactive'])

// ========== LOGIN VALIDATION ==========

export const loginSchema = z.object({
  username: z.string().min(1, REQUIRED_MSG),
  password: passwordSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>

// ========== CHANGE PASSWORD VALIDATION ==========

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, REQUIRED_MSG),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: REQUIRED_MSG,
    path: ['confirmPassword'],
  })

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

// ========== ADMIN USER VALIDATION ==========

const baseAdminUserSchema = z.object({
  username: z.string().min(1, REQUIRED_MSG).min(3, 'Username must be at least 3 characters.').transform((val) => val.trim()),
  firstName: z.string().min(1, REQUIRED_MSG).max(25, 'First name must not exceed 25 characters.').transform((val) => val.trim()),
  lastName: z.string().min(1, REQUIRED_MSG).max(25, 'Last name must not exceed 25 characters.').transform((val) => val.trim()),
  email: emailSchema,
  status: statusSchema,
})

export const createAdminUserSchema = baseAdminUserSchema.extend({
  password: passwordSchema,
})

export const editAdminUserSchema = baseAdminUserSchema.extend({
  password: z.string().optional().or(z.literal('')),
}).superRefine((data, ctx) => {
  const pwd = data.password;
  if (pwd && pwd.length > 0 && pwd.length < PASSWORD_MIN_LENGTH) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: PASSWORD_MIN_MSG,
      path: ['password'],
    });
  }
});

// Use union type to support both create and edit modes
export type AdminUserFormData = z.infer<typeof createAdminUserSchema> | z.infer<typeof editAdminUserSchema>

// ========== VOUCHER VALIDATION ==========

export const voucherSchema = z
  .object({
    code: z
      .string()
      .min(1, REQUIRED_MSG)
      .max(50, REQUIRED_MSG)
      .transform((val) => val.trim()),
    description: z.string().optional().or(z.literal('')),
    startDate: z.string().min(1, REQUIRED_MSG),
    endDate: z.string().min(1, REQUIRED_MSG),
    quantityUse: z.coerce.number({ message: REQUIRED_MSG }).int(REQUIRED_MSG).positive(REQUIRED_MSG),
    type: z.enum(['percentage', 'fixed'], { message: REQUIRED_MSG }),
    amount: z.coerce.number({ message: REQUIRED_MSG }).min(0.01, REQUIRED_MSG),
    minPayAmount: z.coerce.number({ message: REQUIRED_MSG }).min(0, REQUIRED_MSG),
    maxDiscountAmount: z.coerce.number({ message: REQUIRED_MSG }).min(0, REQUIRED_MSG),
    status: statusSchema,
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: REQUIRED_MSG,
    path: ['endDate'],
  })
  .refine(
    (data) => {
      if (data.type === 'percentage') {
        return data.amount <= 100
      }
      return true
    },
    {
      message: REQUIRED_MSG,
      path: ['amount'],
    }
  )

export type VoucherFormData = z.infer<typeof voucherSchema>

// ========== HELP DOCUMENT VALIDATION ==========

export const helpDocumentSchema = z.object({
  title: z
    .string()
    .min(1, REQUIRED_MSG)
    .transform((val) => val.trim()),
  content: z
    .string()
    .min(1, REQUIRED_MSG)
    .transform((val) => val.trim()),
  status: statusSchema,
})

export type HelpDocumentFormData = z.infer<typeof helpDocumentSchema>

// ========== SEARCH SETTINGS VALIDATION ==========

export const searchSettingSchema = z.object({
  keyword: z.string().min(1, REQUIRED_MSG),
  count: z.number().min(1).default(1),
})

export type SearchSettingFormData = z.infer<typeof searchSettingSchema>

// ========== CATEGORY VALIDATION ==========

export const createCategorySchema = z.object({
  title: z.string().min(1, REQUIRED_MSG),
  name: z.string().min(1, REQUIRED_MSG),
  status: statusSchema,
  image: z.string().min(1, REQUIRED_MSG),
})

export const editCategorySchema = z.object({
  title: z.string().min(1, REQUIRED_MSG),
  name: z.string().min(1, REQUIRED_MSG),
  status: statusSchema,
  image: z.string().optional(),
})

export type CategoryFormData = z.infer<typeof createCategorySchema>

// ========== ARTICLE VALIDATION ==========

export const createArticleSchema = z.object({
  title: z.string().min(1, REQUIRED_MSG),
  author: z.string().min(1, REQUIRED_MSG),
  status: z.string().min(1, REQUIRED_MSG),
  categoryId: z.string().min(1, REQUIRED_MSG),
  duration: z.coerce.number({ message: REQUIRED_MSG }).min(1, REQUIRED_MSG),
  content: z.string().min(1, REQUIRED_MSG),
  featuredImageId: z.string().min(1, REQUIRED_MSG),
})

export const editArticleSchema = z.object({
  title: z.string().min(1, REQUIRED_MSG),
  author: z.string().min(1, REQUIRED_MSG),
  status: z.string().min(1, REQUIRED_MSG),
  categoryId: z.string().min(1, REQUIRED_MSG),
  duration: z.coerce.number({ message: REQUIRED_MSG }).min(1, REQUIRED_MSG),
  content: z.string().min(1, REQUIRED_MSG),
  featuredImageId: z.string().optional().default(''),
})

export type ArticleFormData = z.infer<typeof createArticleSchema>

// ========== PD SESSION VALIDATION ==========

export const createPDSessionSchema = z.object({
  title: z.string().min(1, REQUIRED_MSG),
  author: z.string().min(1, REQUIRED_MSG),
  status: z.string().min(1, REQUIRED_MSG),
  categoryId: z.string().min(1, REQUIRED_MSG),
  timeToRead: z.coerce.number({ message: REQUIRED_MSG }).min(1, REQUIRED_MSG),
  content: z.string().min(1, REQUIRED_MSG),
  featuredImageId: z.string().min(1, REQUIRED_MSG),
})

export const editPDSessionSchema = z.object({
  title: z.string().min(1, REQUIRED_MSG),
  author: z.string().min(1, REQUIRED_MSG),
  status: z.string().min(1, REQUIRED_MSG),
  categoryId: z.string().min(1, REQUIRED_MSG),
  timeToRead: z.coerce.number({ message: REQUIRED_MSG }).min(1, REQUIRED_MSG),
  content: z.string().min(1, REQUIRED_MSG),
  featuredImageId: z.string().optional().default(''),
})

export type PDSessionFormData = z.infer<typeof createPDSessionSchema>
