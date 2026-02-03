import { useEffect, useCallback, useMemo, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import type { TransactionFormValues } from '../../types'
import { useTransactionFormContext } from '../../context/TransactionFormContext'
import { SelectController } from '../form/share/SelectController'
import { 
  TransactionDateField, 
  TransactionPercentageField, 
  TransactionTextField 
} from '../form/share/TransactionFormFields'
import { CouponPaymentTable } from '../form/CouponPaymentTable'
import { useGetIsinHolding, useGetIsinDetail } from '../../hooks'
import { formatNumber } from '../../utils/formatters'

export function TransactionFormCoupon() {
  const { watch, setValue, formState: { errors } } = useFormContext<TransactionFormValues>()
  const { 
    options,
    loadingStates,
    formattedOptions, 
    minDate, 
    maxDate,
    onChange,
    mode
  } = useTransactionFormContext()
  
  // Watch all values at once
  const selectedIsin = watch('isin')
  const couponPayments = watch('couponPayments') || []
  const paymentDate = watch('paymentDate')
  const totalAmount = watch('totalCouponAmount') || 0

  // Fetch ISIN detail (security name, currency)
  const { data: isinDetail } = useGetIsinDetail(selectedIsin)
  
  // Fetch holdings when ISIN selected
  const { data: holdingsData, isLoading: isLoadingHoldings } = useGetIsinHolding(selectedIsin)
  const holdings = holdingsData?.data || []

  const { isinOptions } = formattedOptions

  const onChangeCurrencyRef = useRef(onChange.currency)
  useEffect(() => {
    onChangeCurrencyRef.current = onChange.currency
  }, [onChange.currency])

  // Handle ISIN change
  const handleIsinChange = useCallback((isinValue: string | null) => {
    if (!isinValue) return
    
    setValue('description', `Coupon Payment ${isinValue}`)
  
    if (!paymentDate) {
      setValue('paymentDate', new Date())
    }
  }, [setValue, paymentDate])

  useEffect(() => {
    if (isinDetail?.data) {
      setValue('securityName', isinDetail.data.securityName)
      setValue('currency', isinDetail.data.currency)
      onChangeCurrencyRef.current(isinDetail.data.currency)
    }
  }, [isinDetail?.data, setValue])

  // Initialize coupon payments when holdings loaded (only once)
  const isPaymentsInitialized = useRef(false)
  useEffect(() => {
    if (holdings.length > 0 && couponPayments.length === 0 && !isPaymentsInitialized.current) {
      const initialPayments = holdings.map(holding => ({
        clientName: holding.clientName,
        organizationNum: holding.organizationNum,
        subOrganizationNum: holding.subOrganizationNum,
        subAccountNum: holding.subAccountNum,
        effectiveValueAmt: holding.effectiveValueAmt,
        cashOrderAmt: 0,
        currency: holding.currency,
        bankAccountTo: ''
      }))
      setValue('couponPayments', initialPayments)
      isPaymentsInitialized.current = true
    }
  }, [holdings, couponPayments.length, setValue])

  // Calculate total with useMemo
  const calculatedTotal = useMemo(() => {
    return couponPayments.reduce((sum, p) => sum + (p.cashOrderAmt || 0), 0)
  }, [couponPayments])

  // Update total only when different
  useEffect(() => {
    if (calculatedTotal !== totalAmount) {
      setValue('totalCouponAmount', calculatedTotal, { shouldValidate: false })
    }
  }, [calculatedTotal, totalAmount, setValue])

  // Handle coupon rate change
  const handleCouponRateChange = useCallback((value: number | null) => {
    if (!value || couponPayments.length === 0) return
    
    const updatedPayments = couponPayments.map(payment => ({
      ...payment,
      cashOrderAmt: (value / 100) * payment.effectiveValueAmt
    }))
    setValue('couponPayments', updatedPayments)
  }, [couponPayments, setValue])

  return (
    <>
      {/* ISIN */}
      <div className="form-table-row">
        <label className="form-table-label">ISIN <span className="required-asterisk">*</span></label>
        <div className="form-table-input">
          <SelectController
            name="isin"
            options={isinOptions}
            isLoading={loadingStates.isins}
            placeholder="Select ISIN"
            extendOnChange={handleIsinChange}
            disabled={mode === 'submit'}
          />
          {errors.isin && <span className="form-error">{errors.isin.message}</span>}
        </div>
      </div>

      {/* Only show remaining fields when ISIN is selected */}
      {selectedIsin && (
        <>
          {/* Transaction ID */}
          <div className="form-table-row">
            <label className="form-table-label">Transaction ID</label>
            <div className="form-table-input">
              <span className="form-value-text">-</span>
            </div>
          </div>

          {/* Security Name */}
          <TransactionTextField
            name="securityName"
            label="Security Name"
            disabled
          />

          {/* Currency */}
          <TransactionTextField
            name="currency"
            label="Currency"
            required
            disabled
          />

          {/* Coupon Payment Rate */}
          <TransactionPercentageField
            name="couponPercentageRate"
            label="Coupon Payment Rate"
            required
            tooltip="Percentage rate for coupon payment"
            onChange={handleCouponRateChange}
            disabled={mode === 'submit'}
          />

          {/* Payment Details Table */}
          <div className="form-table-row" style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Payment Details</h3>
            {isLoadingHoldings ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                Loading holdings...
              </div>
            ) : (
              <CouponPaymentTable 
                holdings={holdings}
                bankAccounts={options.bankAccounts}
                isLoadingBanks={loadingStates.bankAccounts}
                isDisabled={mode === 'submit'}
              />
            )}
            {errors.couponPayments && typeof errors.couponPayments === 'object' && 'message' in errors.couponPayments && (
              <span className="form-error">{errors.couponPayments.message as string}</span>
            )}
          </div>

          {/* Total Payment Amount */}
          <div className="form-table-row">
            <label className="form-table-label" style={{ fontWeight: 600 }}>Total Payment Amount</label>
            <div className="form-table-input">
              <div style={{ fontSize: '16px', fontWeight: 600, padding: '10px 0' }}>
                {couponPayments[0]?.currency || 'EUR'} {formatNumber(totalAmount)}
              </div>
            </div>
          </div>

          {/* Payment Date */}
          <TransactionDateField
            name="paymentDate"
            label="Payment Date"
            required
            minDate={minDate}
            maxDate={maxDate}
            disabled={mode === 'submit'}
          />

          {/* Description */}
          <TransactionTextField
            name="description"
            label="Description"
            required
            fullWidth
            disabled={mode === 'submit'}
          />
        </>
      )}
    </>
  )
}
