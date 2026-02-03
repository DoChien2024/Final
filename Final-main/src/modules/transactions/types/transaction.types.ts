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
  clientName: string
  organizationName: string
  organizationNum: string
  subOrganizationName: string
  subOrganizationNum: string
  subAccountNum: string | null
  effectiveValueAmt: number
  currency: string
}

// ==================== COUPON PAYMENT TYPE ====================

export interface CouponPaymentRow {
  clientName: string
  organizationNum: string
  subOrganizationNum: string
  subAccountNum: string | null
  effectiveValueAmt: number
  cashOrderAmt: number
  currency: string
  bankAccountTo: string
}

// ==================== FORM VALUES TYPE ====================

import type { TransactionType, TransactionStatus } from '../constants'

export interface TransactionFormValues {
  transactionType: TransactionType | ''
  status: TransactionStatus | ''
  clientName?: string
  subOrgName?: string
  transactionId?: string
  currency: string
  amount: number | null
  fees?: number | null
  bankCharges?: number | null
  gstAmount?: number | null
  effectiveDate: Date
  bankAccount: string
  description: string
  createdDate?: Date
  supportingDocs?: File[]
  internalComments?: string
  // Coupon Payment specific fields
  isin?: string
  securityName?: string
  couponPercentageRate?: number | null
  paymentDate?: Date
  couponPayments?: CouponPaymentRow[]
  totalCouponAmount?: number
}

// ==================== OPTIONS & LOADING TYPE ====================

export interface TransactionOptions {
  orgs: Organization[]
  subOrgs: SubOrganization[] | any[]
  currencies: Currency[] | string[]
  bankAccounts: BankAccount[] | any[]
  isins?: Isin[]
}

export interface LoadingStates {
  orgs: boolean
  subOrgs: boolean
  currencies: boolean
  bankAccounts: boolean
  isins?: boolean
}

// ==================== API PAYLOAD TYPES ====================

export interface CashTransactionPayload {
  action: 'request-draft' | 'request-pending' | 'request-complete'
  data: {
    orgNum?: string
    subOrgNum?: string
    transactionType: string
    currency: string
    amount: number
    effectiveDo: string // format: YYYY-MM-DD
    description: string
    feesAmt?: number | null
    gstAmt?: number | null
    bankChargesAmt?: number | null
    bankAccountUid?: string
    createdDo?: string
    comments?: string
    files?: string[]
    // Coupon Payment specific
    couponPayments?: CouponPaymentRow[]
    totalCouponAmount?: number
    isin?: string
    couponPercentageRate?: number
    paymentDo?: string
  }
}
