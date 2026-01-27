import { FormProvider } from 'react-hook-form'
import { FiX, FiInfo } from 'react-icons/fi'
import { useTransactionForm } from '../../hooks/useTransactionForm'
import type { TransactionCategory } from '../../constants'

// Import trực tiếp 3 Form nhỏ
import { TransactionDetailsForm } from '../form/TransactionDetailsForm'
import { DocumentAttachmentForm } from '../form/DocumentAttachmentForm'
import { InternalCommentsForm } from '../form/InternalCommentsForm'

interface Props {
  type: TransactionCategory
  onClose: () => void
}

export function TransactionFormModal({ type, onClose }: Props) {
  const {
    form,
    handleSubmit,
    onSaveAndClose,
    handleClose,
    ...fieldProps // Gom tất cả transactionTypeOptions, options, loadingStates...
  } = useTransactionForm({ category: type, onClose })

  const hasSelectedType = !!fieldProps.watchedValues.transactionType

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container-fullscreen" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            Create Transaction - {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button onClick={handleClose} className="modal-close-btn"><FiX /></button>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="modal-form-fullscreen">
            {/* Info Banner */}
            <div className="info-banner">
              <FiInfo className="info-icon" />
              <p className="info-message">
                This transaction is in <strong>Draft</strong> status. Please update the transaction details before submitting...
              </p>
            </div>

            {/* Render trực tiếp các form con - Thay thế cho TransactionFormFields */}
            <div className="transaction-form-fields">
              <TransactionDetailsForm
                {...fieldProps} 
                showAllFields={hasSelectedType}
                type={type === 'debit' ? 'Debit' : 'Credit'}
              />
              <DocumentAttachmentForm defaultOpen={hasSelectedType} />
              <InternalCommentsForm defaultOpen={hasSelectedType} />
            </div>

            {/* Footer */}
            <div className="modal-footer-fixed">
              <button type="button" onClick={handleClose} className="btn-outline">Close</button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={onSaveAndClose} className="btn-secondary">Save And Close</button>
                <button type="submit" className="btn-primary">Save And Submit</button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}