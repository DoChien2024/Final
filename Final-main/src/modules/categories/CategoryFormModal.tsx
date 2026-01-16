import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiX } from 'react-icons/fi'
import type { Category } from './category.types'
import { mediaService } from '@/services/media.service'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useCategoryFormMutations } from './hooks/useCategoryFormMutations'
import { FormField } from '@/components/form/FormField'
import { createCategorySchema, editCategorySchema, CategoryFormData } from '@/utils/validationSchemas'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  category?: Category | null
  mode: 'create' | 'edit'
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  category,
  mode,
}: CategoryFormModalProps) {
  const [uploading, setUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [imageChanged, setImageChanged] = useState(false)
  const { confirmCreate, confirmUpdate } = useConfirmStore()
  const { createMutation, updateMutation } = useCategoryFormMutations(category)
  
  const isLoading = createMutation.isPending || updateMutation.isPending
  
  // Cấu trúc Form: Dùng chung 1 Form & 1 Schema cho cả Create và Edit
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(mode === 'create' ? createCategorySchema : editCategorySchema) as any,
    mode: 'onChange',
    defaultValues: {
      name: '',
      title: '',
      status: 'active',
      image: '',
    },
  })
  
  useEffect(() => {
    if (!isOpen) {
      // Cleanup: Đặt hàm reset form vào sự kiện onClose
      return
    }
    
    // Xử lý Dữ liệu: Phân biệt mode bằng cờ (flag), fill dữ liệu bằng defaultValues
    if (mode === 'edit' && category) {
      const imageUri = category.picture?.uri || ''
      reset({
        name: category.name || '',
        title: category.title || '',
        status: category.status || 'active',
        image: '',
      })
      setImagePreview(imageUri)
      setImageChanged(false)
    } else if (mode === 'create') {
      reset({ 
        name: '', 
        title: '', 
        status: 'active', 
        image: '' 
      })
      setImagePreview('')
      setImageChanged(false)
    }
  }, [category, mode, isOpen, reset])
  
  // Cleanup: Đặt hàm reset form vào sự kiện onClose
  const handleClose = () => {
    reset({ 
      name: '', 
      title: '', 
      status: 'active', 
      image: '' 
    })
    setImagePreview('')
    setImageChanged(false)
    onClose()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      
      // Step 1: Get signed URL from backend
      const signedUrlResponse = await mediaService.getSignedUrl('images')
      
      // Step 2: Upload file to S3 using signed URL
      const uploadedUrl = await mediaService.uploadToS3(
        signedUrlResponse.data.url,
        signedUrlResponse.data.fields,
        file
      )
      
      // Step 3: Set the S3 URL to form
      setValue('image', uploadedUrl, { shouldValidate: true })
      setImagePreview(uploadedUrl)
      setImageChanged(true)
    } catch (error: any) {
      console.error('Failed to upload image:', error)
    } finally {
      setUploading(false)
    }
  }

  const onSubmitForm = (data: CategoryFormData) => {
    if (uploading) return
    
    // In edit mode, only send image if it was changed
    const submitData = mode === 'edit' && !imageChanged 
      ? (() => { const { image, ...rest } = data; return rest as CategoryFormData })()
      : data
    
    if (mode === 'create') {
      confirmCreate(() => createMutation.mutate(submitData), 'this category')
    } else if (category) {
      confirmUpdate(() => updateMutation.mutate({ id: category.id, data: submitData }), 'this category')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Create Category' : 'Edit Category'}
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

          {/* Name */}
          <FormField
            name="name"
            label="Name"
            type="text"
            placeholder="Name"
            register={register}
            error={errors.name}
            disabled={isLoading}
            required
          />

          {/* Status */}
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className={`form-select ${errors.status ? 'error' : ''}`}
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && <span className="error-message">{errors.status.message}</span>}
          </div>

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
              disabled={isLoading || uploading}
              className={errors.image ? 'error' : ''}
            />
            {uploading && <p style={{ color: '#5e35b1', fontSize: '14px', marginTop: '8px' }}>Uploading...</p>}
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
            {errors.image && <span className="error-message">{errors.image.message}</span>}
          </div>

          <div className="modal-footer">
            <button 
              type="submit" 
              disabled={isLoading || uploading} 
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

