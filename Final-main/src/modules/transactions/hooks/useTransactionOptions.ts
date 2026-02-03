import { useMemo } from 'react'
import type { TransactionCategory } from '../constants'
import { getTransactionConfig } from '../constants'
import { useGetListOrgs, useGetListSubOrgs, useGetListCurrencies, useGetListBankAccounts } from './useOrg'
import { useGetListIsins } from './useIsin'
import type { TransactionOptions, LoadingStates } from '../types'
import { getTransactionTypeOptions, getTransactionStatusOptions } from '../store/useTransactionOptionsStore'

interface UseTransactionOptionsParams {
  category: TransactionCategory
  transactionType: string
  clientName?: string
  currency: string
}

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

export const useTransactionOptions = ({
  category,
  transactionType,
  clientName,
  currency,
}: UseTransactionOptionsParams) => {
  // ==================== TRANSACTION TYPE OPTIONS (FROM STORE) ====================
  const transactionTypeOptions = useMemo(() => getTransactionTypeOptions(category), [category])
  
  // ==================== TRANSACTION STATUS OPTIONS (FROM STORE) ====================
  const transactionStatusOptions = useMemo(() => getTransactionStatusOptions(), [])

  // ==================== API HOOKS ====================
  const { data: orgsData, isLoading: isLoadingOrgs } = useGetListOrgs()
  const { data: currenciesData, isLoading: isLoadingCurrencies } = useGetListCurrencies()
  const { data: isinsData, isLoading: isLoadingIsins } = useGetListIsins()

  // ==================== DEPENDENT API CALLS ====================
  const { data: subOrgsData, isLoading: isLoadingSubOrgs } = useGetListSubOrgs(clientName)
  const { data: bankAccountsData, isLoading: isLoadingBankAccounts } = useGetListBankAccounts(currency)

  // ==================== COMPUTED OPTIONS ====================
  const options: TransactionOptions = useMemo(
    () => ({
      orgs: orgsData?.data || [],
      subOrgs: subOrgsData?.data || [],
      currencies: currenciesData || [],
      bankAccounts: bankAccountsData?.data || [],
      isins: isinsData?.data || [],
    }),
    [orgsData, subOrgsData, currenciesData, bankAccountsData, isinsData]
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
