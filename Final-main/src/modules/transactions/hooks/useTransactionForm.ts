import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransactionModalStore } from '../store/useTransactionModalStore'

import { transactionFormSchema, minDate, maxDate } from '../schema'
import type { TransactionCategory } from '../constants'
import type { TransactionFormValues } from '../types'
import { useTransactionOptions } from './useTransactionOptions'
import { useTransactionFieldHandlers } from './useTransactionFieldHandlers'

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
  _hasBankOptions: false,
}

export const useTransactionForm = ({ category, onClose }: UseTransactionFormProps) => {
  const { openConfirm } = useTransactionModalStore()
  
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

  // Save and Submit: Full validation, show confirm page
  const onSaveAndSubmit = useCallback(
    (data: TransactionFormValues) => {
      console.log('=== FORM: onSaveAndSubmit called ===')
      console.log('Validated data:', data)
      openConfirm(data, 'submit')
    },
    [openConfirm]
  )

  // Handle validation errors
  const onSaveAndSubmitError = useCallback(
    (errors: any) => {
      console.log('=== FORM: Validation errors ==>', errors)
      
      // Scroll to first error field
      setTimeout(() => {
        const firstErrorField = Object.keys(errors)[0]
        const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.focus()
        }
      }, 100)
    },
    []
  )

  // Save and Close: No validation, show confirm page
  const onSaveAndClose = useCallback(
    () => {
      const rawData = getValues()
      console.log('=== FORM: onSaveAndClose called ===')
      console.log('Raw data (no validation):', rawData)
      openConfirm(rawData, 'draft')
    },
    [getValues, openConfirm]
  )

  const handleClose = useCallback(() => {
    reset(DEFAULT_FORM_VALUES)
    onClose()
  }, [reset, onClose])

  const handleReset = useCallback(() => reset(DEFAULT_FORM_VALUES), [reset])

  return {
    form,
    control,
    handleSubmit: handleSubmit(onSaveAndSubmit, onSaveAndSubmitError),
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