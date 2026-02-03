import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { transactionFormSchema, minDate, maxDate } from '../schema'
import type { TransactionCategory } from '../constants'
import type { TransactionFormValues } from '../types'
import { useTransactionOptions } from './useTransactionOptions'
import { useTransactionFieldHandlers } from './useTransactionFieldHandlers'
import { createCashTransaction } from '../api'
import { buildTransactionPayload } from '../utils/payloadBuilder'
import { useApiMutation } from '@/hooks/useApiMutation'

interface UseTransactionFormProps {
  category: TransactionCategory
  onClose: () => void
}

const DEFAULT_FORM_VALUES: TransactionFormValues = {
  transactionType: '',
  status: '',
  clientName: '',
  subOrgName: '',
  transactionId: '-',
  currency: '',
  amount: null,
  fees: null,
  bankCharges: null,
  gstAmount: null,
  effectiveDate: new Date(),
  createdDate: new Date(),
  bankAccount: '',
  description: '',
  supportingDocs: [],
  internalComments: '',
}

export const useTransactionForm = ({ category, onClose }: UseTransactionFormProps) => {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema) as any,
    mode: 'onChange',
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const { control, setValue, reset, handleSubmit, watch, getValues } = form
  const transactionType = watch('transactionType')
  const clientName = watch('clientName')
  const currency = watch('currency')

  const { transactionTypeOptions, transactionStatusOptions, options, loadingStates, fieldVisibility, formattedOptions } = useTransactionOptions({
    category,
    transactionType,
    clientName,
    currency,
  })

  const handlers = useTransactionFieldHandlers({ setValue, getValues, options })
  
  const onChange = {
    transactionType: handlers.handleTransactionTypeChange,
    clientName: handlers.handleClientChange,
    currency: handlers.handleCurrencyChange,
    bankAccount: handlers.handleBankAccountChange,
  }

  const handleSuccess = useCallback(() => {
    reset(DEFAULT_FORM_VALUES)
    onClose()
  }, [reset, onClose])

  const submitMutation = useApiMutation(
    createCashTransaction,
    { onSuccess: handleSuccess, successMessage: 'Transaction submitted successfully!' }
  )

  const saveMutation = useApiMutation(
    createCashTransaction,
    { onSuccess: handleSuccess, successMessage: 'Transaction saved as draft!' }
  )

  const onSubmit = useCallback(
    async (data: TransactionFormValues) => {
      const action = data.status === 'Complete' ? 'request-complete' : 'request-pending'
      await submitMutation(buildTransactionPayload(data, action))
    },
    [submitMutation]
  )

  const onSaveAndClose = useCallback(
    async () => {
      await saveMutation(buildTransactionPayload(getValues(), 'request-draft'))
    },
    [getValues, saveMutation]
  )

  const handleClose = useCallback(() => {
    reset(DEFAULT_FORM_VALUES)
    onClose()
  }, [reset, onClose])

  const handleReset = useCallback(() => reset(DEFAULT_FORM_VALUES), [reset])

  return {
    form,
    control,
    handleSubmit: handleSubmit(onSubmit),
    options,
    loadingStates,
    transactionTypeOptions,
    transactionStatusOptions,
    fieldVisibility,
    formattedOptions,
    minDate,
    maxDate,
    onChange,
    onSaveAndClose,
    handleClose,
    handleReset,
    transactionType,
    clientName,
    currency,
  }
}