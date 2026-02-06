import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransactionModalStore } from '../store/useTransactionModalStore'

import { transactionFormSchema, minDate, maxDate } from '../schema'
import { getTransactionConfig } from '../constants'
import type { TransactionFormValues } from '../types'
import { useTransactionOptions } from './useTransactionOptions'

interface UseTransactionFormProps {
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

export const useTransactionForm = ({ onClose }: UseTransactionFormProps) => {
  const { openConfirm } = useTransactionModalStore()
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema) as any,
    mode: 'onTouched', // Validate when field is touched/blurred
    reValidateMode: 'onChange', // Re-validate on every change after first submission
    defaultValues: DEFAULT_FORM_VALUES,
    shouldFocusError: true, // Auto focus & scroll to first error field
    criteriaMode: 'firstError', // Stop at first error per field
  })

  const { control, setValue, reset, watch, handleSubmit, clearErrors, getValues } = form
  const transactionType = watch('transactionType')
  const clientName = watch('clientName')
  const currency = watch('currency')

  const { transactionTypeOptions, transactionStatusOptions, options, loadingStates, fieldVisibility, formattedOptions } = useTransactionOptions({
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
      // Clear description error after auto-fill
      if (config.descriptionAutoFill) {
        clearErrors('description')
      }
    },
    [setValue, clearErrors]
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

  // Handle validation errors - shouldFocusError will auto scroll & focus
  const onSaveAndSubmitError = useCallback(() => {
    // React Hook Form will auto focus & scroll to first error field
    // No need for manual error handling
  }, [])

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