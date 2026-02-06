import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useApiMutation } from '@/hooks/useApiMutation'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useTransactionModalStore } from '../store/useTransactionModalStore'
import { useTransactionOptions } from './useTransactionOptions'
import { createCashTransaction } from '../api'
import { buildTransactionPayload } from '../utils/payloadBuilder'
import { minDate, maxDate } from '../schema'
import type { TransactionFormValues } from '../types'

interface UseTransactionConfirmParams {
  formData: TransactionFormValues | null
  mode: 'draft' | 'submit' | null
}

export const useTransactionConfirm = ({
  formData,
  mode,
}: UseTransactionConfirmParams) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { showConfirm, hideConfirm } = useConfirmStore()
  const { closeModal, mode: storeMode } = useTransactionModalStore()

  // Create form with data from previous step
  const form = useForm<TransactionFormValues>({
    defaultValues: formData || {},
    mode: 'onChange',
  })

  // Get options for context (same as form modal)
  const {
    transactionTypeOptions,
    transactionStatusOptions,
    options,
    loadingStates,
    fieldVisibility,
    formattedOptions,
  } = useTransactionOptions({
    transactionType: formData?.transactionType || '',
    clientName: formData?.clientName || '',
    currency: formData?.currency || '',
  })

  // API mutation for final submission
  const createMutation = useApiMutation(createCashTransaction, {
    onSuccess: () => {
      hideConfirm()
      closeModal() // Close modal using store
      navigate('/transactions', { replace: true })
    },
    successMessage:
      mode === 'draft'
        ? 'Transaction saved as draft!'
        : 'Transaction submitted successfully!',
  })

  // Context value for form components
  const contextValue = useMemo(
    () => ({
      form,
      transactionTypeOptions,
      transactionStatusOptions,
      options,
      loadingStates,
      fieldVisibility,
      formattedOptions,
      minDate,
      maxDate,
      transactionType: formData?.transactionType,
      clientName: formData?.clientName || '',
      currency: formData?.currency,
      onChange: {
        transactionType: () => {},
        clientName: () => {},
        currency: () => {},
        bankAccount: () => {},
      },
      type: storeMode || 'Debit',
      mode: mode as 'draft' | 'submit',
    }),
    [
      form,
      transactionTypeOptions,
      transactionStatusOptions,
      options,
      loadingStates,
      fieldVisibility,
      formattedOptions,
      formData,
      storeMode,
      mode,
    ]
  )

  const handleCreate = () => {
    if (!formData) return

    // Show confirm dialog before API call
    showConfirm({
      title: mode === 'draft' ? 'Save as Draft' : 'Submit Transaction',
      message:
        mode === 'draft'
          ? 'Save this transaction as draft? You can complete it later.'
          : 'Submit this transaction for processing? This action cannot be undone.',
      confirmText: mode === 'draft' ? 'Save Draft' : 'Submit',
      cancelText: 'Cancel',
      variant: 'default',
      onConfirm: async () => {
        setIsLoading(true)
        try {
          const action = mode === 'draft' ? 'request-draft' : 'request-complete'
          await createMutation(buildTransactionPayload(formData, action))
        } catch (error) {
          console.error('API Error:', error)
        } finally {
          setIsLoading(false)
        }
      },
    })
  }

  return {
    form,
    contextValue,
    handleCreate,
    isLoading,
  }
}
