import { useMemo } from 'react'
import { getTransactionConfig, DEBIT_TRANSACTION_TYPES, CREDIT_TRANSACTION_TYPES, TRANSACTION_STATUSES } from '../constants'
import { useGetListOrgs, useGetListSubOrgs, useGetListCurrencies, useGetListBankAccounts } from './useOrg'
import { useGetListIsins } from './useIsin'
import { useTransactionModalStore } from '../store/useTransactionModalStore'
import type { TransactionOptions, LoadingStates, FormattedOptions } from '../types'

interface UseTransactionOptionsParams {
  transactionType: string
  clientName?: string
  currency: string
}

export const useTransactionOptions = ({
  transactionType,
  clientName,
  currency,
}: UseTransactionOptionsParams) => {
  // Lấy mode từ Store
  const { mode } = useTransactionModalStore()

  // ==================== TRANSACTION TYPE OPTIONS ====================
  const transactionTypeOptions = useMemo(() => {
    const types = mode === 'Debit' ? DEBIT_TRANSACTION_TYPES : CREDIT_TRANSACTION_TYPES
    return types.map((t) => ({ label: t, value: t }))
  }, [mode])
  
  // ==================== TRANSACTION STATUS OPTIONS ====================
  const transactionStatusOptions = useMemo(() => {
    return TRANSACTION_STATUSES.map((s) => ({ label: s, value: s }))
  }, [])

  // ==================== API HOOKS ====================
  const { data: orgsData, isLoading: isLoadingOrgs } = useGetListOrgs()
  const { data: currenciesData, isLoading: isLoadingCurrencies } = useGetListCurrencies()
  const { data: isinsData, isLoading: isLoadingIsins } = useGetListIsins()

  // ==================== DEPENDENT API CALLS ====================
  const { data: subOrgsData, isLoading: isLoadingSubOrgs } = useGetListSubOrgs(clientName)
  const { data: bankAccountsData, isLoading: isLoadingBankAccounts } = useGetListBankAccounts()

  // ==================== COMPUTED OPTIONS ====================
  const options: TransactionOptions = useMemo(
    () => {
      // Filter bank accounts by currency on client side
      const allBankAccounts = bankAccountsData?.data || []
      const filteredBankAccounts = currency 
        ? allBankAccounts.filter(account => account.currency === currency)
        : allBankAccounts // Show all if no currency selected
      
      return {
        orgs: orgsData?.data || [],
        subOrgs: subOrgsData?.data || [],
        currencies: currenciesData || [],
        bankAccounts: filteredBankAccounts,
        isins: isinsData?.data || [],
      }
    },
    [orgsData, subOrgsData, currenciesData, bankAccountsData, isinsData, currency]
  )

  // ==================== COMPUTED LOADING STATES ====================
  const loadingStates: LoadingStates = useMemo(
    () => ({
      orgs: isLoadingOrgs,
      subOrgs: isLoadingSubOrgs,
      currencies: isLoadingCurrencies,
      bankAccounts: isLoadingBankAccounts,
      isins: isLoadingIsins,
    }),
    [isLoadingOrgs, isLoadingSubOrgs, isLoadingCurrencies, isLoadingBankAccounts, isLoadingIsins]
  )

  // ==================== FORMATTED OPTIONS ====================
  const formattedOptions: FormattedOptions = useMemo(
    () => ({
      orgOptions: options.orgs.map(org => ({ 
        label: org.name, 
        value: org.id 
      })),
      subOrgOptions: options.subOrgs.map(sub => ({ 
        label: sub.name, 
        value: sub.subOrgId || sub.id || '' 
      })),
      currencyOptions: options.currencies.map(c => 
        typeof c === 'string' 
          ? { label: c, value: c } 
          : { label: `${c.code} - ${c.name}`, value: c.code }
      ),
      bankOptions: options.bankAccounts.map(b => ({ 
        label: b.displayName || `${b.bankName} - ${b.accountNumber}`, 
        value: b.bankAccountUid || b.id || ''
      })),
      isinOptions: (options.isins || []).map(isin => ({ 
        label: `${isin.isin} - ${isin.securityName}`, 
        value: isin.isin 
      })),
    }),
    [options]
  )

  // ==================== FIELD VISIBILITY ====================
  const fieldVisibility = useMemo(() => getTransactionConfig(transactionType), [transactionType])

  // ==================== RETURN ====================
  return {
    transactionTypeOptions,
    transactionStatusOptions,
    options,
    loadingStates,
    fieldVisibility,
    formattedOptions,
  }
}
