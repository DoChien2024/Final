import { FiAlertCircle } from 'react-icons/fi'
import { useConfirmStore } from '@/store/useConfirmStore'

export default function GlobalConfirmDialog() {
  const { isOpen, title, message, confirmText, cancelText, variant, isLoading, onConfirm, hideConfirm } = useConfirmStore()

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <div className="confirm-dialog-overlay" onClick={hideConfirm}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-dialog-icon ${variant === 'danger' ? 'danger' : 'info'}`}>
          <FiAlertCircle />
        </div>
        
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-message">{message}</p>
        
        <div className="confirm-dialog-actions">
          <button
            type="button"
            onClick={hideConfirm}
            className="btn-cancel"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`btn-confirm ${variant === 'danger' ? 'danger' : 'primary'}`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
