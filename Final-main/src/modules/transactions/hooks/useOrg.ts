import { useQuery } from '@tanstack/react-query'
import { fetchListOrg, fetchListSubOrg, fetchListCurrency, fetchListBankAccount } from '../api'

// Hook để lấy danh sách Org
export const useGetListOrgs = () => {
  return useQuery({
    queryKey: ['orgs'],
    queryFn: fetchListOrg,
  })
}

// Hook để lấy danh sách SubOrg dựa theo orgId
export const useGetListSubOrgs = (orgId?: string) => {
  return useQuery({
    queryKey: ['subOrgs', orgId],
    queryFn: () => fetchListSubOrg(orgId),
    enabled: !!orgId,
  })
}

// Hook để lấy danh sách Currency
export const useGetListCurrencies = () => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: fetchListCurrency,
  })
}

// Hook để lấy danh sách Bank Account dựa theo currency
export const useGetListBankAccounts = (currency?: string, type?: string) => {
  return useQuery({
    queryKey: ['bankAccounts', currency, type],
    queryFn: () => fetchListBankAccount({ currency, type }),
    enabled: !!currency,
  })
}
