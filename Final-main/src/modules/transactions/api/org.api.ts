import type { Organization, SubOrganization, BankAccount } from '../types'
import { mockOrgs, mockSubOrgs } from '../mock-data/org'
import { mockCurrencies } from '../mock-data/currency'
import { mockBankAccounts } from '../mock-data/bank-account'

// ==================== ORG API ====================

export const fetchListOrg = async () => {
  return new Promise<{ data: Organization[] }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: mockOrgs,
        }),
      500,
    ),
  )
}

export const fetchListSubOrg = async (orgNum?: string) => {
  return new Promise<{ data: SubOrganization[] }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: mockSubOrgs[orgNum as string] || [],
        }),
      500,
    ),
  )
}

// ==================== CURRENCY API ====================

export const fetchListCurrency = async () => {
  return new Promise<string[]>((resolve) =>
    setTimeout(() => resolve(mockCurrencies), 500),
  )
}

// ==================== BANK ACCOUNT API ====================

export const fetchListBankAccount = async ({
  currency,
}: {
  currency?: string
  type?: string
}) => {
  const filteredAccounts = !!currency
    ? mockBankAccounts.filter((account) => account.currency === currency)
    : mockBankAccounts
  return new Promise<{ data: BankAccount[] }>((resolve) =>
    setTimeout(
      () =>
        resolve({
          data: filteredAccounts,
        }),
      500,
    ),
  )
}
