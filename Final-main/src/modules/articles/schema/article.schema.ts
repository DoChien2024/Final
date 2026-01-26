import { z } from 'zod'

const REQUIRED_MSG = 'This field is required.'

// Base schema shared between create and edit
const articleBaseSchema = {
  title: z
    .string()
    .min(1, REQUIRED_MSG)
    .max(200, 'Title must not exceed 200 characters'),
  author: z
    .string()
    .min(1, REQUIRED_MSG)
    .max(100, 'Author must not exceed 100 characters'),
  status: z.enum(['draft', 'published', 'unpublished'], { 
    message: REQUIRED_MSG 
  }),
  categoryId: z.string().min(1, REQUIRED_MSG),
  duration: z.coerce
    .number({ message: REQUIRED_MSG })
    .int('Duration must be an integer')
    .min(1, 'Duration must be at least 1 minute')
    .max(999, 'Duration must not exceed 999 minutes'),
  content: z.string().min(1, REQUIRED_MSG),
}

// Create schema - requires featured image
export const createArticleSchema = z.object({
  ...articleBaseSchema,
  featuredImageId: z.string().min(1, REQUIRED_MSG),
})

// Edit schema - featured image is optional
export const editArticleSchema = z.object({
  ...articleBaseSchema,
  featuredImageId: z.string().optional(),
})

// Infer form data type from schema
export type ArticleFormData = z.infer<typeof createArticleSchema>
