import { useCallback } from 'react'
import type { UseFormSetValue, UseFormGetValues } from 'react-hook-form'
import { getTransactionConfig } from '../constants'
import type { TransactionFormValues, TransactionOptions } from '../types'

interface UseTransactionFieldHandlersParams {
  setValue: UseFormSetValue<TransactionFormValues>
  getValues: UseFormGetValues<TransactionFormValues>
  options: TransactionOptions
}

export const useTransactionFieldHandlers = ({
  setValue,
  getValues,
  options,
}: UseTransactionFieldHandlersParams) => {
  // ==================== TRANSACTION TYPE CHANGE ====================
  const handleTransactionTypeChange = useCallback(
    (newType: string) => {
      // Reset dependent fields
      setValue('fees', null)
      setValue('bankCharges', null)
      setValue('gstAmount', null)

      // Auto-fill description based on transaction type config
      const config = getTransactionConfig(newType)
      // Always set description (can be empty string or auto-filled text)
      setValue('description', config.descriptionAutoFill)
    },
    [setValue]
  )

  // ==================== CLIENT NAME CHANGE ====================
  const handleClientChange = useCallback(() => {
    setValue('subOrgName', '')
  }, [setValue])

  // ==================== CURRENCY CHANGE ====================
  const handleCurrencyChange = useCallback(
    () => {
      setValue('bankAccount', '')
    },
    [setValue]
  )

  // ==================== BANK ACCOUNT CHANGE ====================
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

  // ==================== RETURN ====================
  return {
    handleTransactionTypeChange,
    handleClientChange,
    handleCurrencyChange,
    handleBankAccountChange,
  }
}
