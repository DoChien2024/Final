import { FiAlertCircle, FiX } from 'react-icons/fi'
import { useModalStore } from '@/store/modalStore'
import { useArticleFormMutations } from '../hooks/useArticleFormMutations'
import { useConfirmStore } from '@/store/useConfirmStore'

export default function ArticleDelete() {
  const { isOpen, selectedData, close } = useModalStore()
  const { deleteMutation } = useArticleFormMutations()
  const { confirmDelete } = useConfirmStore()

  if (!isOpen || !selectedData) return null

  const handleDelete = () => {
    confirmDelete(
      () => deleteMutation.mutate(selectedData.id),
      'this article'
    )
  }

  const handleCancel = () => {
    close()
  }

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div 
        className="modal-content"
        style={{ maxWidth: '450px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div className="flex items-center gap-2">
            <FiAlertCircle className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold">Confirm Delete</h2>
          </div>
          <button
            onClick={handleCancel}
            className="btn-icon"
            aria-label="Close"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body" style={{ padding: '2rem' }}>
          <p className="text-gray-700">
            Are you sure you want to delete <strong>"{selectedData.title}"</strong>?
          </p>
          <p className="text-gray-500 text-sm mt-2">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div 
          className="modal-footer" 
          style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            justifyContent: 'flex-end',
            borderTop: '1px solid #e5e7eb',
            padding: '1rem 2rem'
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
            disabled={deleteMutation.isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="btn-danger"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}
