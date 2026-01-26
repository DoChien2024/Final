// ==================== ENTITY TYPES ====================

export interface Organization {
  id: string
  name: string
  shortName?: string
  countryCode?: string
}

export interface SubOrganization {
  id?: string
  name: string
  parentOrgId?: string
  orgId?: string
  subOrgId?: string
  description?: string
}

export interface BankAccount {
  id?: string
  bankAccountUid?: string
  accountName?: string
  accountNumber?: string
  bankName?: string
  currency?: string
  beneficiaryName?: string
  beneficiaryBankName?: string
  beneficiaryBankAccountNumber?: string
  beneficiaryBankSwift?: string
  correspondentBankName?: string
  correspondentBankSwift?: string
  displayName?: string
}

export interface Currency {
  id: string
  code: string
  name: string
}

export interface Isin {
  isin: string
  securityName: string
  currency: string
}

export interface IsinHolding {
  organizationName: string
  subOrganizationName: string
  effectiveValueAmt: string
}

// ==================== FORM VALUES TYPE ====================

import type { TransactionType, TransactionStatus } from '../constants'

export interface TransactionFormValues {
  transactionType: TransactionType | ''
  status: TransactionStatus
  clientName: string
  subOrgName: string
  transactionId: string
  currency: string
  amount: number | null
  fees: number | null
  bankCharges: number | null
  gstAmount: number | null
  effectiveDate: Date
  bankAccount: string
  description: string
  createdDate: Date
  supportingDocs: File[]
  internalComments: string
}

// ==================== OPTIONS & LOADING TYPE ====================

export interface TransactionOptions {
  orgs: Organization[]
  subOrgs: SubOrganization[] | any[]
  currencies: Currency[] | string[]
  bankAccounts: BankAccount[] | any[]
}

export interface LoadingStates {
  orgs: boolean
  subOrgs: boolean
  currencies: boolean
  bankAccounts: boolean
}
