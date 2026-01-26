import { useEffect, useMemo, useCallback } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { transactionFormSchema, minDate, maxDate } from '../schema'
import {
  type TransactionCategory,
  DEBIT_TRANSACTION_TYPES,
  CREDIT_TRANSACTION_TYPES,
  TRANSACTION_FIELD_CONFIG,
  type FieldVisibility,
} from '../constants'
import type {
  TransactionFormValues,
  TransactionOptions,
  LoadingStates,
} from '../types'

// Mock Data
import { mockOrgs, mockSubOrgs } from '../mock-data/org'
import { mockCurrencies } from '../mock-data/currency'
import { mockBankAccounts } from '../mock-data/bank-account'

interface UseTransactionFormProps {
  category: TransactionCategory
  onClose: () => void
}

export const useTransactionForm = ({ category, onClose }: UseTransactionFormProps) => {
  // ==================== FORM SETUP ====================
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema) as any,
    mode: 'onChange',
    defaultValues: {
      transactionType: '',
      status: 'Draft',
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
    },
  })

  const { control, setValue, reset, handleSubmit, register, formState: { errors } } = form

  // ==================== WATCHED FIELDS ====================
  const [transactionType, clientName, currency, bankAccount] = useWatch({
    control,
    name: ['transactionType', 'clientName', 'currency', 'bankAccount'],
  })

  // ==================== COMPUTED: Transaction Type Options ====================
  const transactionTypeOptions = useMemo(() => {
    const types = category === 'debit' ? DEBIT_TRANSACTION_TYPES : CREDIT_TRANSACTION_TYPES
    return types.map(t => ({ label: t, value: t }))
  }, [category])

  // ==================== COMPUTED: Field Visibility ====================
  const fieldVisibility: FieldVisibility = useMemo(() => {
    if (!transactionType || !TRANSACTION_FIELD_CONFIG[transactionType as keyof typeof TRANSACTION_FIELD_CONFIG]) {
      return {
        showClientFields: true,
        showFees: false,
        showBankCharges: false,
        showGstAmount: false,
        bankDirection: null,
        descriptionAutoFill: '',
        descriptionEditable: true,
      }
    }
    return TRANSACTION_FIELD_CONFIG[transactionType as keyof typeof TRANSACTION_FIELD_CONFIG]
  }, [transactionType])

  // ==================== COMPUTED: Sub Orgs filtered by Client ====================
  const filteredSubOrgs = useMemo(() => {
    if (!clientName) return []
    const selectedOrg = mockOrgs.find(org => org.id === clientName)
    if (!selectedOrg) return []
    // mockSubOrgs is a Record<string, any[]>
    return mockSubOrgs[selectedOrg.id] || []
  }, [clientName])

  // ==================== COMPUTED: Bank Accounts filtered by Currency ====================
  const filteredBankAccounts = useMemo(() => {
    if (!currency) return [] // Empty list when no currency selected
    return mockBankAccounts.filter(bank => bank.currency === currency)
  }, [currency])

  // ==================== ALL BANK ACCOUNTS (for autofill currency) ====================
  const allBankAccounts = mockBankAccounts

  // ==================== OPTIONS ====================
  const options: TransactionOptions = useMemo(() => ({
    orgs: mockOrgs,
    subOrgs: filteredSubOrgs,
    currencies: mockCurrencies,
    bankAccounts: filteredBankAccounts,
  }), [filteredSubOrgs, filteredBankAccounts])

  // ==================== LOADING STATES (Mock - sẽ thay bằng real API) ====================
  const loadingStates: LoadingStates = useMemo(() => ({
    orgs: false,
    subOrgs: false,
    currencies: false,
    bankAccounts: false,
  }), [])

  // ==================== EFFECTS ====================
  
  // Effect: Reset subOrg khi client thay đổi & auto-select nếu chỉ có 1
  useEffect(() => {
    setValue('subOrgName', '')
    
    // Auto-select nếu có data
    if (filteredSubOrgs.length === 1) {
      const subOrgValue = filteredSubOrgs[0].subOrgId || filteredSubOrgs[0].id || ''
      setValue('subOrgName', subOrgValue)
    }
  }, [clientName, filteredSubOrgs, setValue])

  // Effect: Reset bankAccount khi currency thay đổi & auto-select nếu chỉ có 1
  useEffect(() => {
    setValue('bankAccount', '')
    
    // Auto-select nếu chỉ có 1 bank account
    if (filteredBankAccounts.length === 1) {
      setValue('bankAccount', filteredBankAccounts[0].bankAccountUid || '')
    }
  }, [currency, filteredBankAccounts, setValue])

  // Effect: Auto-fill currency khi chọn bank account (nếu chưa có currency)
  useEffect(() => {
    if (bankAccount && !currency) {
      const selectedBank = allBankAccounts.find(
        bank => bank.bankAccountUid === bankAccount
      )
      if (selectedBank?.currency) {
        setValue('currency', selectedBank.currency)
      }
    }
  }, [bankAccount, currency, allBankAccounts, setValue])

  // Effect: Auto-fill description khi transaction type thay đổi
  useEffect(() => {
    if (transactionType && fieldVisibility.descriptionAutoFill) {
      setValue('description', fieldVisibility.descriptionAutoFill)
    } else if (transactionType) {
      setValue('description', '')
    }
  }, [transactionType, fieldVisibility.descriptionAutoFill, setValue])

  // Effect: Reset form khi category thay đổi
  useEffect(() => {
    reset({
      transactionType: '',
      status: 'Draft',
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
    })
  }, [category, reset])

  // ==================== HANDLERS ====================
  const onSubmit = useCallback((data: TransactionFormValues) => {
    console.log('Submit Transaction:', data)
    // TODO: Call API
    onClose()
  }, [onClose])

  const onSaveAndClose = useCallback(() => {
    const data = form.getValues()
    console.log('Save Draft:', data)
    // TODO: Call API save draft
    onClose()
  }, [form, onClose])

  const handleClose = useCallback(() => {
    reset()
    onClose()
  }, [reset, onClose])

  // ==================== RETURN ====================
  return {
    // Form
    form,
    control,
    register,
    errors,
    handleSubmit: handleSubmit(onSubmit),
    
    // Options
    options,
    loadingStates,
    transactionTypeOptions,
    
    // Field visibility
    fieldVisibility,
    
    // Date constraints
    minDate,
    maxDate,
    
    // Handlers
    onSaveAndClose,
    handleClose,
    
    // Watched values (for conditional rendering)
    watchedValues: {
      transactionType,
      clientName,
      currency,
    },
  }
}