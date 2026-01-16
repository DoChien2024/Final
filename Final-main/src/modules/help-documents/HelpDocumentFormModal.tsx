import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiX } from 'react-icons/fi'
import { FormTextarea } from '@/components/form/FormTextarea'
import { helpDocumentSchema, type HelpDocumentFormData } from '@/utils/validationSchemas'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useHelpDocumentFormMutations } from './hooks/useHelpDocumentFormMutations'
import type { HelpDocument } from './help-document.types'

interface HelpDocumentFormModalProps {
  isOpen: boolean
  onClose: () => void
  helpDocument?: HelpDocument | null
  mode: 'create' | 'edit'
}

export default function HelpDocumentFormModal({
  isOpen,
  onClose,
  helpDocument,
  mode,
}: HelpDocumentFormModalProps) {
  const { confirmCreate, confirmUpdate } = useConfirmStore()
  const { createMutation, updateMutation } = useHelpDocumentFormMutations()
  
  const isLoading = createMutation.isPending || updateMutation.isPending
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<HelpDocumentFormData>({ 
    resolver: zodResolver(helpDocumentSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      status: 'active',
    },
  })

  const titleValue = watch('title')
  const titleLength = titleValue?.length || 0

  // Cleanup: Đặt hàm reset form vào sự kiện onClose
  const handleClose = () => {
    reset({
      title: '',
      content: '',
      status: 'active',
    })
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    
    // Xử lý Dữ liệu: Phân biệt mode bằng cờ (flag), fill dữ liệu bằng defaultValues
    if (helpDocument && mode === 'edit') {
      reset({
        title: helpDocument.title || '',
        content: helpDocument.content || '',
        status: (helpDocument.status as 'active' | 'inactive') || 'active',
      })
    } else if (mode === 'create') {
      reset({
        title: '',
        content: '',
        status: 'active' as const,
      })
    }
  }, [helpDocument, mode, isOpen, reset])

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Create Help Document' : 'Update Help Document'}
          </h2>
          <button onClick={handleClose} className="modal-close-btn" disabled={isLoading}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit((data) => {
          if (mode === 'create') {
            confirmCreate(() => createMutation.mutate(data), 'this help document')
          } else if (helpDocument) {
            confirmUpdate(() => updateMutation.mutate({ id: helpDocument.id, data }), 'this help document')
          }
        })} className="modal-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="required-asterisk">*</span>
            </label>
            <input
              type="text"
              id="title"
              placeholder="Title"
              className={`form-input ${errors.title ? 'error' : ''}`}
              disabled={isLoading}
              maxLength={50}
              {...register('title')}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              {errors.title && <span className="error-message">{errors.title.message}</span>}
              <span style={{ fontSize: '12px', color: titleLength > 50 ? '#dc3545' : '#6c757d', marginLeft: 'auto' }}>
                {titleLength}/50
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className={`form-select ${errors.status ? 'error' : ''}`}
              disabled={isLoading}
              {...register('status')}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && <span className="error-message">{errors.status.message}</span>}
          </div>

          <FormTextarea
            name="content"
            label="Content"
            register={register}
            error={errors.content}
            placeholder="Enter content..."
            rows={5}
            required
            disabled={isLoading}
          />

          <div className="modal-footer">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              style={{ width: '100%' }}
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
