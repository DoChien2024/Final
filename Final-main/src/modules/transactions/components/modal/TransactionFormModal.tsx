import { FormProvider } from 'react-hook-form'
import { FiX, FiInfo } from 'react-icons/fi'
import { useTransactionForm } from '../../hooks/useTransactionForm'
import { useTransactionModalStore } from '../../store/useTransactionModalStore'
import type { TransactionCategory } from '../../constants'
import { TransactionFormProvider } from '../../context/TransactionFormContext'

// Import forms
import { TransactionDetailsForm } from '../form/TransactionDetailsForm'
import { DocumentAttachmentForm } from '../form/DocumentAttachmentForm'
import { InternalCommentsForm } from '../form/InternalCommentsForm'
import { TransactionConfirmOverlay } from '../confirm'

interface Props {
  type: TransactionCategory
  onClose: () => void
}

export function TransactionFormModal({ type, onClose }: Props) {
  const { showConfirm } = useTransactionModalStore()
  const {
    form,
    handleSubmit,
    onSaveAndClose,
    handleClose,
    options,
    loadingStates,
    transactionTypeOptions,
    transactionStatusOptions,
    fieldVisibility,
    formattedOptions,
    minDate,
    maxDate,
    onChange,
    transactionType,
    clientName,
    currency,
  } = useTransactionForm({ category: type, onClose })

  const contextValue = {
    form,
    transactionTypeOptions,
    transactionStatusOptions,
    options,
    loadingStates,
    fieldVisibility,
    formattedOptions,
    minDate,
    maxDate,
    transactionType,
    clientName,
    currency,
    onChange,
    type: (type === 'debit' ? 'Debit' : 'Credit') as 'Debit' | 'Credit',
  }

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

        <TransactionFormProvider value={contextValue}>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit} className="modal-form-fullscreen">
              {/* Info Banner */}
              <div className="info-banner">
                <FiInfo className="info-icon" />
                <p className="info-message">
                  This transaction is in <strong>Draft</strong> status. Please update the transaction details before submitting...
                </p>
              </div>

              <div className="transaction-form-fields">
                <TransactionDetailsForm />
                <DocumentAttachmentForm defaultOpen={!!transactionType} />
                <InternalCommentsForm defaultOpen={!!transactionType} />
              </div>

              {/* Footer */}
              <div className="modal-footer-fixed">
                <button type="button" onClick={handleClose} className="btn-outline">
                  Close
                </button>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={onSaveAndClose} 
                    className="btn-secondary"
                  >
                    Save And Close
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                  >
                    Save And Submit
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </TransactionFormProvider>
      </div>

      {/* Confirm Overlay - shows on top of form modal */}
      {showConfirm && <TransactionConfirmOverlay category={type} />}
    </div>
  )
}