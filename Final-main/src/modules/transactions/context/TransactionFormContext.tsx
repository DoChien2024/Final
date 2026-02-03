import { createContext, useContext, ReactNode } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { TransactionFormValues, TransactionOptions, LoadingStates } from '../types'
import type { FieldVisibility } from '../constants'

interface SelectOption {
  label: string
  value: string
}

interface FormattedOptions {
  orgOptions: SelectOption[]
  subOrgOptions: SelectOption[]
  currencyOptions: SelectOption[]
  bankOptions: SelectOption[]
  isinOptions: SelectOption[]
}

interface OnChangeHandlers {
  transactionType: (value: string) => void
  clientName: () => void
  currency: (value: string | null) => void
  bankAccount: (value: string | null) => void
}

interface TransactionFormContextValue {
  form: UseFormReturn<TransactionFormValues>
  transactionTypeOptions: SelectOption[]
  transactionStatusOptions: SelectOption[]
  options: TransactionOptions
  loadingStates: LoadingStates
  fieldVisibility: FieldVisibility
  formattedOptions: FormattedOptions
  minDate: Date
  maxDate: Date
  transactionType: string | undefined
  clientName: string | undefined
  currency: string | undefined
  onChange: OnChangeHandlers
  type: 'Debit' | 'Credit'
}

const TransactionFormContext = createContext<TransactionFormContextValue | undefined>(undefined)

export const useTransactionFormContext = () => {
  const context = useContext(TransactionFormContext)
  if (!context) {
    throw new Error('useTransactionFormContext must be used within TransactionFormProvider')
  }
  return context
}

interface TransactionFormProviderProps {
  value: TransactionFormContextValue
  children: ReactNode
}

export const TransactionFormProvider = ({ value, children }: TransactionFormProviderProps) => {
  return (
    <TransactionFormContext.Provider value={value}>
      {children}
    </TransactionFormContext.Provider>
  )
}
