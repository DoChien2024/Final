import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransactionModalStore } from '../store/useTransactionModalStore'
import { useToastStore } from '@/store/toastStore'

import { transactionFormSchema, minDate, maxDate } from '../schema'
import { getTransactionConfig } from '../constants'
import type { TransactionCategory } from '../constants'
import type { TransactionFormValues } from '../types'
import { useTransactionOptions } from './useTransactionOptions'

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
  const { showToast } = useToastStore()
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema) as any,
    mode: 'onTouched', // Validate when field is touched/blurred
    reValidateMode: 'onChange', // Re-validate on every change after first submission
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

  // ==================== FIELD CHANGE HANDLERS ====================
  
  // Handler: Transaction Type Change
  const handleTransactionTypeChange = useCallback(
    (newType: string) => {
      setValue('fees', null)
      setValue('bankCharges', null)
      setValue('gstAmount', null)
      
      const config = getTransactionConfig(newType)
      setValue('description', config.descriptionAutoFill)
    },
    [setValue]
  )

  // Handler: Client Name Change
  const handleClientChange = useCallback(() => {
    setValue('subOrgName', '')
  }, [setValue])

  // Handler: Currency Change
  const handleCurrencyChange = useCallback(() => {
    setValue('bankAccount', '')
  }, [setValue])

  // Handler: Bank Account Change
  const handleBankAccountChange = useCallback(
    (bankAccountUid: string | null) => {
      const currentCurrency = getValues('currency')
      if (bankAccountUid && !currentCurrency && options.bankAccounts) {
        const selectedBank = options.bankAccounts.find(
          (bank: any) => bank.bankAccountUid === bankAccountUid
        )
        if (selectedBank?.currency) {
          setValue('currency', selectedBank.currency)
        }
      }
    },
    [setValue, getValues, options.bankAccounts]
  )
  
  const onChange = {
    transactionType: handleTransactionTypeChange,
    clientName: handleClientChange,
    currency: handleCurrencyChange,
    bankAccount: handleBankAccountChange,
  }

  // Save and Submit: Full validation, show confirm page
  const onSaveAndSubmit = useCallback(
    (data: TransactionFormValues) => {
      openConfirm(data, 'submit')
    },
    [openConfirm]
  )

  // Handle validation errors
  const onSaveAndSubmitError = useCallback(
    (errors: any) => {
      const errorCount = Object.keys(errors).length
      showToast(`Please fix ${errorCount} validation error(s) before submitting`, 'error')
      
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
    [showToast]
  )

  // Save and Close: No validation, show confirm page
  const onSaveAndClose = useCallback(() => {
    openConfirm(getValues(), 'draft')
  }, [getValues, openConfirm])

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