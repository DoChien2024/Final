import { FormProvider } from 'react-hook-form'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'
import { TransactionFormProvider } from '../../context/TransactionFormContext'
import { TransactionDetailsForm } from '../form/TransactionDetailsForm'
import { DocumentAttachmentForm } from '../form/DocumentAttachmentForm'
import { InternalCommentsForm } from '../form/InternalCommentsForm'

interface TransactionConfirmViewProps {
  mode: 'draft' | 'submit'
  contextValue: any
  form: any
  isLoading: boolean
  onBack: () => void
  onCreate: () => void
  variant?: 'page' | 'overlay'
}

export function TransactionConfirmView({
  mode,
  contextValue,
  form,
  isLoading,
  onBack,
  onCreate,
  variant = 'page',
}: TransactionConfirmViewProps) {
  const content = (
    <>
      {/* Header */}
      <div className="confirm-header">
        <div>
          <h1 className="confirm-title">Review Transaction</h1>
          <p className="confirm-subtitle">
            Please review the transaction details before{' '}
            {mode === 'draft' ? 'saving as draft' : 'submitting'}
          </p>
        </div>
        <span
          className={`status-badge ${mode === 'draft' ? 'warning' : 'success'}`}
        >
          {mode === 'draft' ? 'Draft Mode' : 'Ready to Submit'}
        </span>
      </div>

      {/* Form (Read-only) */}
      <TransactionFormProvider value={contextValue}>
        <FormProvider {...form}>
          <fieldset disabled={mode === 'submit'} className="confirm-form">
            <div className="confirm-form-content">
              <TransactionDetailsForm />
              <DocumentAttachmentForm defaultOpen={true} />
              <InternalCommentsForm defaultOpen={true} />
            </div>
          </fieldset>
        </FormProvider>
      </TransactionFormProvider>

      {/* Actions */}
      <div className="confirm-actions">
        <button
          type="button"
          onClick={onBack}
          className="btn-outline"
          disabled={isLoading}
        >
          <FiArrowLeft />
          Back to Edit
        </button>
        <button
          type="button"
          onClick={onCreate}
          className="btn-primary"
          disabled={isLoading}
        >
          <FiCheck />
          {isLoading
            ? 'Processing...'
            : mode === 'draft'
            ? 'Save as Draft'
            : 'Submit Transaction'}
        </button>
      </div>
    </>
  )

  // Render as page or overlay
  if (variant === 'overlay') {
    return (
      <div className="confirm-overlay-backdrop" onClick={onBack}>
        <div
          className="confirm-overlay-container"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="transaction-confirm-page">
      <div className="confirm-container">{content}</div>
    </div>
  )
}
