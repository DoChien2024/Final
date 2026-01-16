import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiX } from 'react-icons/fi'
import type { TrendingKeyword, TrendingKeywordFormData } from './settings.types'
import { FormField } from '@/components/form/FormField'
import { searchSettingSchema } from '@/utils/validationSchemas'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useSearchSettingFormMutations } from './hooks/useSearchSettingFormMutations'

interface SearchSettingFormModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: TrendingKeyword | null
  mode: 'create' | 'edit'
}

export default function SearchSettingFormModal({
  isOpen,
  onClose,
  initialData,
  mode,
}: SearchSettingFormModalProps) {
  const { confirmCreate, confirmUpdate } = useConfirmStore()
  const { createMutation, updateMutation } = useSearchSettingFormMutations()
  const isLoading = createMutation.isPending || updateMutation.isPending
  
  // Cấu trúc Form: Dùng chung 1 Form & 1 Schema cho cả Create và Edit
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrendingKeywordFormData>({
    resolver: zodResolver(searchSettingSchema),
    mode: 'onChange',
    defaultValues: {
      keyword: '',
      count: 1,
    },
  })

  // Cleanup: Đặt hàm reset form vào sự kiện onClose
  const handleClose = () => {
    reset({
      keyword: '',
      count: 1,
    })
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    
    // Xử lý Dữ liệu: Phân biệt mode bằng cờ (flag), fill dữ liệu bằng defaultValues
    if (mode === 'edit' && initialData) {
      reset({
        keyword: initialData.keyword || '',
        count: initialData.count || 1,
      })
    } else if (mode === 'create') {
      reset({
        keyword: '',
        count: 1,
      })
    }
  }, [initialData, mode, isOpen, reset])

  const onSubmitForm = (data: TrendingKeywordFormData) => {
    if (mode === 'edit' && initialData) {
      confirmUpdate(() => updateMutation.mutate({ id: initialData.id, data }), 'this keyword')
    } else {
      confirmCreate(() => createMutation.mutate(data), 'this keyword')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Create Trending Keyword' : 'Update Trending Keyword'}
          </h2>
          <button onClick={handleClose} className="modal-close-btn" disabled={isLoading}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          {/* Keyword */}
          <FormField
            name="keyword"
            label="Text"
            type="text"
            placeholder="Text"
            register={register}
            error={errors.keyword}
            disabled={isLoading}
            required
          />

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : mode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

