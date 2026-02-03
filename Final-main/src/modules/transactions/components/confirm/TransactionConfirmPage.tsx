import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'

import { TransactionFormProvider } from '../../context/TransactionFormContext'
import { TransactionDetailsForm } from '../form/TransactionDetailsForm'
import { DocumentAttachmentForm } from '../form/DocumentAttachmentForm'
import { InternalCommentsForm } from '../form/InternalCommentsForm'

import { createCashTransaction } from '../../api'
import { buildTransactionPayload } from '../../utils/payloadBuilder'
import { useApiMutation } from '@/hooks/useApiMutation'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useTransactionModalStore } from '../../store/useTransactionModalStore'
import { useTransactionOptions } from '../../hooks/useTransactionOptions'
import type { TransactionFormValues } from '../../types'
import type { TransactionCategory } from '../../constants'
import { minDate, maxDate } from '../../schema'

interface LocationState {
  formData: TransactionFormValues
  mode: 'draft' | 'submit'
  category: TransactionCategory
}

export function TransactionConfirmPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  // Guard: Redirect if no data
  useEffect(() => {
    if (!state?.formData) {
      navigate('/transactions', { replace: true })
    }
  }, [state, navigate])

  const { formData, mode, category } = state || {}

  // Create form with data from previous step
  const form = useForm<TransactionFormValues>({
    defaultValues: formData,
    mode: 'onChange',
  })

  // Get options for context (same as form modal)
  const { 
    transactionTypeOptions, 
    transactionStatusOptions, 
    options, 
    loadingStates, 
    fieldVisibility, 
    formattedOptions 
  } = useTransactionOptions({
    category: category!,
    transactionType: formData?.transactionType || '',
    clientName: formData?.clientName || '',
    currency: formData?.currency || '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const { showConfirm, hideConfirm } = useConfirmStore()
  const { closeModal } = useTransactionModalStore()

  // API mutation for final submission
  const createMutation = useApiMutation(createCashTransaction, {
    onSuccess: () => {
      hideConfirm()
      closeModal() // Close modal using store
      navigate('/transactions', { replace: true })
    },
    successMessage: mode === 'draft' ? 'Transaction saved as draft!' : 'Transaction submitted successfully!',
  })

  const handleCreate = () => {
    if (!formData) return

    console.log('=== CONFIRM PAGE: handleCreate called ===')
    console.log('Mode:', mode)
    console.log('FormData:', formData)

    // Temporarily disable confirm dialog for testing
    // TODO: Re-enable after fixing navigation
    const executeCreate = async () => {
      setIsLoading(true)
      try {
        const action = mode === 'draft' ? 'request-draft' : 'request-complete'
        console.log('Calling API with action:', action)
        await createMutation(buildTransactionPayload(formData, action))
      } catch (error) {
        console.error('API Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Show confirm dialog before API call
    showConfirm({
      title: mode === 'draft' ? 'Save as Draft' : 'Submit Transaction',
      message: mode === 'draft' 
        ? 'Save this transaction as draft? You can complete it later.'
        : 'Submit this transaction for processing? This action cannot be undone.',
      confirmText: mode === 'draft' ? 'Save Draft' : 'Submit',
      cancelText: 'Cancel',
      variant: 'default',
      onConfirm: executeCreate
    })
  }

  const handleBack = () => {
    navigate(-1) // Go back to form with data preserved
  }

  if (!formData || !category) return null

  // Context value for form components
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
    transactionType: formData.transactionType,
    clientName: formData.clientName || '',
    currency: formData.currency,
    onChange: {
      transactionType: () => {},
      clientName: () => {},
      currency: () => {},
      bankAccount: () => {},
    },
    type: (category === 'debit' ? 'Debit' : 'Credit') as 'Debit' | 'Credit',
  }

  return (
    <div className="transaction-confirm-page">
      <div className="confirm-container">
        {/* Header */}
        <div className="confirm-header">
          <div>
            <h1 className="confirm-title">Review Transaction</h1>
            <p className="confirm-subtitle">
              Please review the transaction details before {mode === 'draft' ? 'saving as draft' : 'submitting'}
            </p>
          </div>
          <span className={`status-badge ${mode === 'draft' ? 'warning' : 'success'}`}>
            {mode === 'draft' ? 'Draft Mode' : 'Ready to Submit'}
          </span>
        </div>

        {/* Form (Read-only) */}
        <TransactionFormProvider value={contextValue}>
          <FormProvider {...form}>
            <fieldset disabled className="confirm-form">
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
            onClick={handleBack} 
            className="btn-outline"
            disabled={isLoading}
          >
            <FiArrowLeft />
            Back to Edit
          </button>
          <button 
            type="button" 
            onClick={handleCreate} 
            className="btn-primary"
            disabled={isLoading}
          >
            <FiCheck />
            {isLoading 
              ? 'Processing...' 
              : mode === 'draft' ? 'Save as Draft' : 'Submit Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
