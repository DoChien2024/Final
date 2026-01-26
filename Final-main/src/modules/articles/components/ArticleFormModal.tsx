

import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { FiX } from 'react-icons/fi'
import { categoryService } from '@/modules/categories/category.service'
import { mediaService } from '@/services/media.service'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import type { SelectOption } from '@/constants/selectStyles'
import { stripHtmlTags, parseAuthor, parseCategory, parseCategoriesData } from '@/utils/formHelpers'
import { FormField } from '@/components/form/FormField'
import { FormTextarea } from '@/components/form/FormTextarea'
import { FormSelect } from '@/components/form/FormSelect'
import { FormNumberInput } from '@/components/form/FormNumberInput'
import { createArticleSchema, editArticleSchema, type ArticleFormData } from '../schema/article.schema'
import { useArticleFormMutations } from '../hooks/useArticleFormMutations'

interface ArticleFormModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
}

export default function ArticleFormModal({ isOpen, onClose, mode }: ArticleFormModalProps) {
  const [imagePreview, setImagePreview] = useState<string>('')
  const { confirmCreate, confirmUpdate } = useConfirmStore()
  const { selectedData: article } = useModalStore()
  const { createMutation, updateMutation } = useArticleFormMutations()
  
  const isEdit = mode === 'edit'
  const isLoading = createMutation.isPending || updateMutation.isPending

  // Form - Schema tự động validate và coerce types, values tự động sync với article
  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<ArticleFormData>({
    resolver: zodResolver(isEdit ? editArticleSchema : createArticleSchema) as any,
    mode: 'onChange',
    values: {
      title: article?.title ?? '',
      author: parseAuthor(article?.author) ?? '',
      status: article?.status ?? ('' as any),
      categoryId: parseCategory(article?.category) ?? '',
      duration: article?.timeToRead ?? article?.duration ?? (undefined as any),
      content: stripHtmlTags(article?.content ?? '') ?? '',
      featuredImageId: article?.picture?.uri ?? article?.featuredImage?.uri ?? '',
    },
  })

  // Categories dropdown
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => categoryService.getCategories({ page: 1, limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  })

  const categoryOptions: SelectOption[] = useMemo(() => {
    return parseCategoriesData(categoriesData).map(cat => ({
      value: cat.id,
      label: cat.name,
    }))
  }, [categoriesData])

  // Sync image preview với article data
  useEffect(() => {
    setImagePreview(isOpen && article ? (article.picture?.uri ?? article.featuredImage?.uri ?? '') : '')
  }, [article, isOpen])

  // Reset form khi đóng modal create
  const handleClose = () => {
    if (!isEdit) {
      reset()
    }
    onClose()
  }

  // Upload ảnh
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Preview local first
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to S3
      const signedUrlResponse = await mediaService.getSignedUrl('images')
      
      // Check if response has correct structure
      if (!signedUrlResponse.data || !signedUrlResponse.data.url || !signedUrlResponse.data.fields) {
        throw new Error('Invalid signed URL response structure')
      }
      
      const { url, fields } = signedUrlResponse.data
      
      const uploadedUrl = await mediaService.uploadToS3(
        url,
        fields,
        file
      )
      
      // Update preview with uploaded URL
      setImagePreview(uploadedUrl)
      
      // Set URL to form
      setValue('featuredImageId', uploadedUrl, { shouldValidate: true })
    } catch (error: any) {
      console.error('Failed to upload image:', error)
    }
  }

  // Submit form
  const onSubmit = (data: ArticleFormData) => {
    const action = isEdit && article
      ? () => updateMutation.mutate({ id: article.id, data })
      : () => createMutation.mutate(data)
    
    isEdit ? confirmUpdate(action, 'this article') : confirmCreate(action, 'this article')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Article' : 'Create Article'}</h2>
          <button onClick={handleClose} className="modal-close-btn" disabled={isLoading}>
            <FiX />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <FormField name="title" label="Title" placeholder="Enter title" register={register} error={errors.title} disabled={isLoading} required />
          
          <FormField name="author" label="Author" placeholder="Enter author" register={register} error={errors.author} disabled={isLoading} required />

          {/* Status - Schema validates enum */}
          <div className="form-group">
            <label className="form-label">Status <span className="required-asterisk">*</span></label>
            <select {...register('status')} className={`form-select ${errors.status ? 'error' : ''}`} disabled={isLoading}>
              <option value="" disabled hidden >Select Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
            {errors.status && <span className="error-message">{errors.status.message}</span>}
          </div>

          <FormSelect name="categoryId" label="Category" control={control} options={categoryOptions} error={errors.categoryId} disabled={isLoading || categoriesLoading} required placeholder="Select category" isClearable />

          <FormNumberInput name="duration" label="Time to Read (minutes)" placeholder="Enter minutes" register={register} error={errors.duration} disabled={isLoading} required min={1} />

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Image {!isEdit && <span className="required-asterisk">*</span>}</label>
            <input type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} />
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ marginTop: '8px', maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '4px' }} />}
            {errors.featuredImageId && <span className="error-message">{errors.featuredImageId.message}</span>}
          </div>

          <FormTextarea name="content" label="Content" placeholder="Write content..." register={register} error={errors.content} disabled={isLoading} rows={8} required />

          {/* Submit */}
          <div className="modal-footer">
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
