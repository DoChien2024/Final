import { useCallback, useMemo, useRef } from 'react'
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
import { ReadOnlyField } from '../form/ReadOnlyField'

export function TransactionFormCoupon() {
  const { watch, setValue, formState: { errors }, getValues } = useFormContext<TransactionFormValues>()
  const { 
    options,
    loadingStates,
    formattedOptions, 
    minDate, 
    maxDate,
    onChange,
    mode
  } = useTransactionFormContext()
  
  const isReadOnly = !!mode
  
  // Watch all values at once with single subscription
  const formValues = watch()
  const selectedIsin = formValues.isin
  const couponPayments = formValues.couponPayments || []
  const displayCurrency = formValues.currency || 'VND'

  // Fetch ISIN detail (security name, currency)
  const { data: isinDetail } = useGetIsinDetail(selectedIsin)
  
  // Fetch holdings when ISIN selected
  const { data: holdingsData, isLoading: isLoadingHoldings } = useGetIsinHolding(selectedIsin)
  const holdings = holdingsData?.data || []

  const { isinOptions } = formattedOptions

  // Refs to track what's been initialized to avoid re-runs
  const initializedIsinRef = useRef<string | null>(null)
  const initializedHoldingsRef = useRef(false)

  // Auto-populate ISIN details when data loads (replaces useEffect)
  useMemo(() => {
    if (isinDetail?.data && selectedIsin && initializedIsinRef.current !== selectedIsin) {
      initializedIsinRef.current = selectedIsin
      setValue('securityName', isinDetail.data.securityName)
      setValue('currency', isinDetail.data.currency)
      onChange.currency(isinDetail.data.currency)
    }
  }, [isinDetail?.data, selectedIsin, setValue, onChange])

  // Initialize couponPayments from holdings (replaces useEffect)
  useMemo(() => {
    if (holdings.length > 0 && couponPayments.length === 0 && !initializedHoldingsRef.current) {
      initializedHoldingsRef.current = true
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
    }
  }, [holdings, couponPayments.length, setValue])

  // Handle ISIN change
  const handleIsinChange = useCallback((isinValue: string | null) => {
    if (!isinValue) return
    
    // Reset refs when ISIN changes
    initializedIsinRef.current = null
    initializedHoldingsRef.current = false
    
    // Clear existing payments when ISIN changes
    setValue('couponPayments', [])
    setValue('description', `Coupon Payment ${isinValue}`)
  
    if (!getValues('paymentDate')) {
      setValue('paymentDate', new Date())
    }
  }, [setValue, getValues])

  // Calculate total with useMemo
  const calculatedTotal = useMemo(() => {
    return couponPayments.reduce((sum, p) => sum + (p.cashOrderAmt || 0), 0)
  }, [couponPayments])

  // Handle coupon rate change
  const handleCouponRateChange = useCallback((value: number | null) => {
    if (couponPayments.length === 0 || holdings.length === 0) return
    
    // If value is null, 0, or falsy, reset all payments to 0
    const calculatedAmount = value ? (value / 100) : 0
    
    const updatedPayments = couponPayments.map((payment, index) => ({
      ...payment,
      cashOrderAmt: calculatedAmount * holdings[index].effectiveValueAmt
    }))
    setValue('couponPayments', updatedPayments)
    
    // Update total
    const total = updatedPayments.reduce((sum, p) => sum + (p.cashOrderAmt || 0), 0)
    setValue('totalCouponAmount', total)
  }, [couponPayments, holdings, setValue])

  return (
    <>
      {/* ISIN */}
      {isReadOnly ? (
        <ReadOnlyField name="isin" label="ISIN" type="select" options={isinOptions} />
      ) : (
        <div className="form-table-row">
          <label className="form-table-label">ISIN <span className="required-asterisk">*</span></label>
          <div className="form-table-input">
            <SelectController
              name="isin"
              options={isinOptions}
              isLoading={loadingStates.isins}
              placeholder="Select ISIN"
              extendOnChange={handleIsinChange}
            />
            {errors.isin && <span className="form-error">{errors.isin.message}</span>}
          </div>
        </div>
      )}

      {/* Only show remaining fields when ISIN is selected */}
      {selectedIsin && (
        <>
          {/* Transaction ID */}
          <ReadOnlyField name="transactionId" label="Transaction ID" />

          {/* Security Name */}
          {isReadOnly ? (
            <ReadOnlyField name="securityName" label="Security Name" />
          ) : (
            <TransactionTextField name="securityName" label="Security Name" disabled />
          )}

          {/* Currency - HIDDEN */}
          {/* {isReadOnly ? (
            <ReadOnlyField name="currency" label="Currency" />
          ) : (
            <TransactionTextField name="currency" label="Currency" required disabled />
          )} */}

          {/* Coupon Payment Rate */}
          {isReadOnly ? (
            <div className="form-table-row">
              <label className="form-table-label">Coupon Payment Rate</label>
              <div className="form-table-input">
                <span className="form-value-text">
                  {getValues('couponPercentageRate') ? `${getValues('couponPercentageRate')}%` : '-'}
                </span>
              </div>
            </div>
          ) : (
            <TransactionPercentageField
              name="couponPercentageRate"
              label="Coupon Payment Rate"
              required
              tooltip="Percentage rate for coupon payment"
              onChange={handleCouponRateChange}
            />
          )}

          {/* Payment Details Table */}
          <div className="form-table-row" style={{ gridColumn: '1 / -1' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Payment Details</h3>
            {isReadOnly ? (
              couponPayments.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>
                          Client Name / Sub-org Name
                        </th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>
                          Bank Account (To)
                        </th>
                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>
                          Value of Settled Holdings
                        </th>
                        <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>
                          Net Payment Amount ({displayCurrency})
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {couponPayments.map((payment, index) => {
                        // Lookup bank label from options
                        const bankLabel = formattedOptions.bankOptions.find(
                          b => b.value === payment.bankAccountTo
                        )?.label || payment.bankAccountTo || '-'
                        
                        return (
                          <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px' }}>
                              <div style={{ fontWeight: 500, fontSize: '14px' }}>{payment.clientName || '-'}</div>
                              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                {payment.subOrganizationNum || '-'}
                              </div>
                            </td>
                            <td style={{ padding: '12px' }}>{bankLabel}</td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              {formatNumber(payment.effectiveValueAmt)}
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              {formatNumber(payment.cashOrderAmt)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>-</div>
              )
            ) : isLoadingHoldings ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                Loading holdings...
              </div>
            ) : (
              <>
                <CouponPaymentTable 
                  holdings={holdings}
                  bankAccounts={options.bankAccounts}
                  isLoadingBanks={loadingStates.bankAccounts}
                  isDisabled={false}
                />
                {errors.couponPayments && typeof errors.couponPayments === 'object' && 'message' in errors.couponPayments && (
                  <span className="form-error">{errors.couponPayments.message as string}</span>
                )}
              </>
            )}
          </div>

          {/* Total Payment Amount */}
          <div className="form-table-row">
            <label className="form-table-label" style={{ fontWeight: 600 }}>Total Payment Amount</label>
            <div className="form-table-input">
              <div style={{ fontSize: '16px', fontWeight: 600, padding: '10px 0' }}>
                {couponPayments[0]?.currency || 'EUR'} {formatNumber(calculatedTotal)}
              </div>
            </div>
          </div>

          {/* Payment Date */}
          {isReadOnly ? (
            <ReadOnlyField name="paymentDate" label="Payment Date" type="date" />
          ) : (
            <TransactionDateField
              name="paymentDate"
              label="Payment Date"
              required
              minDate={minDate}
              maxDate={maxDate}
            />
          )}

          {/* Description */}
          {isReadOnly ? (
            <ReadOnlyField name="description" label="Description" />
          ) : (
            <TransactionTextField
              name="description"
              label="Description"
              required
              fullWidth
            />
          )}
        </>
      )}
    </>
  )
}
