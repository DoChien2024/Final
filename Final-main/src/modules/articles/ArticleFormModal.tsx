import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { FiX } from 'react-icons/fi'
import { categoryService } from '@/modules/categories/category.service'
import { mediaService } from '@/services/media.service'
import { useConfirmStore } from '@/store/useConfirmStore'
import type { SelectOption } from '@/constants/selectStyles'
import { stripHtmlTags, parseAuthor, parseCategory, parseCategoriesData } from '@/utils/formHelpers'
import type { Article } from './article.types'
import { FormField } from '@/components/form/FormField'
import { FormTextarea } from '@/components/form/FormTextarea'
import { FormSelect } from '@/components/form/FormSelect'
import { FormNumberInput } from '@/components/form/FormNumberInput'
import { createArticleSchema, editArticleSchema, ArticleFormData } from '@/utils/validationSchemas'
import { useArticleFormMutations } from './hooks/useArticleFormMutations'

interface ArticleFormModalProps {
  isOpen: boolean
  onClose: () => void
  article?: Article | null
  mode: 'create' | 'edit'
}

export default function ArticleFormModal({
  isOpen,
  onClose,
  article,
  mode,
}: ArticleFormModalProps) {
  const [imagePreview, setImagePreview] = useState<string>('')
  const { confirmCreate, confirmUpdate } = useConfirmStore()
  const { createMutation, updateMutation } = useArticleFormMutations()
  
  const isLoading = createMutation.isPending || updateMutation.isPending

  // Cấu trúc Form: Dùng chung 1 Form & 1 Schema cho cả Create và Edit
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(mode === 'create' ? createArticleSchema : editArticleSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      author: '',
      status: '' as any,
      categoryId: '',
      duration: undefined,
      content: '',
      featuredImageId: '',
    },
  })

  // Fetch categories for dropdown - cache để tránh fetch lại nhiều lần
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => categoryService.getCategories({ 
      page: 1,
      limit: 1000
    }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Memoize để tránh re-compute khi component re-render
  const categoryOptions: SelectOption[] = useMemo(() => {
    const categories = parseCategoriesData(categoriesData)
    return categories.map(cat => ({
      value: cat.id,
      label: cat.name,
    }))
  }, [categoriesData])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    
    // Xử lý Dữ liệu: Phân biệt mode bằng cờ (flag), fill dữ liệu bằng defaultValues
    if (mode === 'edit' && article) {
      const imageUri = article.picture?.uri || article.featuredImage?.uri || ''
      const authorValue = parseAuthor(article.author) || ''
      const categoryValue = parseCategory(article.category) || ''
      const durationValue = parseInt(article.timeToRead?.toString() || article.duration?.toString() || '1') || 1
      const contentValue = stripHtmlTags(article.content || '') || ''
      
      reset({
        title: article.title || '',
        author: authorValue,
        status: article.status || 'draft',
        categoryId: categoryValue,
        duration: durationValue,
        content: contentValue,
        featuredImageId: imageUri,
      })
      setImagePreview(imageUri)
    } else if (mode === 'create') {
      reset({ 
        title: '', 
        author: '', 
        status: '' as any, 
        categoryId: '', 
        duration: undefined, 
        content: '',
        featuredImageId: '',
      })
      setImagePreview('')
    }
  }, [article, mode, isOpen, reset])
  
  // Cleanup: Đặt hàm reset form vào sự kiện onClose
  const handleClose = () => {
    reset({ 
      title: '', 
      author: '', 
      status: '' as any, 
      categoryId: '', 
      duration: undefined, 
      content: '',
      featuredImageId: '',
    })
    setImagePreview('')
    onClose()
  }

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
      const uploadedUrl = await mediaService.uploadToS3(
        signedUrlResponse.data.url,
        signedUrlResponse.data.fields,
        file
      )
      
      // Set URL to form (backend will handle media creation)
      setValue('featuredImageId', uploadedUrl, { shouldValidate: true })
    } catch (error: any) {
      console.error('Failed to upload image:', error)
    }
  }

  const onSubmitForm = (data: ArticleFormData) => {
    if (mode === 'create') {
      confirmCreate(() => createMutation.mutate(data), 'this article')
    } else if (article) {
      confirmUpdate(() => updateMutation.mutate({ id: article.id, data }), 'this article')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Create Article' : 'Edit Article'}
          </h2>
          <button onClick={handleClose} className="modal-close-btn" disabled={isLoading}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          {/* Title */}
          <FormField
            name="title"
            label="Title"
            type="text"
            placeholder="Title"
            register={register}
            error={errors.title}
            disabled={isLoading}
            required
          />

          {/* Author */}
          <FormField
            name="author"
            label="Author"
            type="text"
            placeholder="Author"
            register={register}
            error={errors.author}
            disabled={isLoading}
            required
          />

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status <span className="required-asterisk">*</span>
            </label>
            <select
              id="status"
              {...register('status')}
              className={`form-select ${errors.status ? 'error' : ''}`}
              disabled={isLoading}
            >
              <option value="" disabled hidden>Select Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
            </select>
            {errors.status && <span className="error-message">{errors.status.message}</span>}
          </div>

          {/* Category */}
          <FormSelect
            name="categoryId"
            label="Category"
            control={control}
            options={categoryOptions}
            error={errors.categoryId}
            disabled={isLoading || categoriesLoading}
            required
            placeholder={categoriesLoading ? "Loading..." : "Select"}
            isClearable={true}
            selectProps={{
              isLoading: categoriesLoading,
              noOptionsMessage: () => "No categories found"
            }}
          />

          {/* Duration */}
          <FormNumberInput
            name="duration"
            label="Duration (minutes)"
            placeholder="Enter minutes"
            register={register}
            error={errors.duration}
            disabled={isLoading}
            required
            min={1}
            step={1}
            allowDecimals={false}
          />

          {/* Image */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Image{mode === 'create' && <span className="required-asterisk"> *</span>}
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              className={errors.featuredImageId ? 'error' : ''}
            />
            {imagePreview && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'contain',
                    borderRadius: '4px',
                    border: '1px solid #e0e0e0'
                  }}
                />
              </div>
            )}
            {errors.featuredImageId && <span className="error-message">{errors.featuredImageId.message}</span>}
          </div>

          {/* Content */}
          <FormTextarea
            name="content"
            label="Content"
            placeholder="Enter article content..."
            register={register}
            error={errors.content}
            disabled={isLoading}
            rows={10}
            required
          />

          <div className="modal-footer">
            <button 
              type="submit" 
              disabled={isLoading} 
              className="btn-primary"
            >
              {isLoading 
                ? (mode === 'create' ? 'Creating...' : 'Updating...') 
                : (mode === 'create' ? 'Create' : 'Update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

