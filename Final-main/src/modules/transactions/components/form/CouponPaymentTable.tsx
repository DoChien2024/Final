import { useMemo, useCallback, useEffect, useRef } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import Select from 'react-select'
import { getSelectStyles } from '@/constants/selectStyles'
import type { TransactionFormValues, BankAccount, IsinHolding } from '../../types'

interface Props {
  holdings: IsinHolding[]
  bankAccounts: BankAccount[]
  isLoadingBanks: boolean
  isDisabled?: boolean
}

export function CouponPaymentTable({ holdings, bankAccounts, isLoadingBanks, isDisabled = false }: Props) {
  const { control, setValue, watch, trigger, formState: { errors } } = useFormContext<TransactionFormValues>()
  
  const couponPayments = watch('couponPayments') || []
  const couponRate = watch('couponPercentageRate') || 0
  
  // Track if user manually edited any payment
  const manualEditRef = useRef<Set<number>>(new Set())
  
  // Get currency from first holding
  const displayCurrency = holdings[0]?.currency || 'EUR'

  // Auto-fill payments when coupon rate changes (only for non-manually-edited rows)
  useEffect(() => {
    if (!couponRate || couponPayments.length === 0 || holdings.length === 0) return
    
    const shouldUpdate = couponPayments.some((payment, index) => {
      if (manualEditRef.current.has(index)) return false
      const expectedValue = (couponRate / 100) * holdings[index]?.effectiveValueAmt
      return Math.abs(payment.cashOrderAmt - expectedValue) > 0.01
    })
    
    if (shouldUpdate) {
      const updatedPayments = couponPayments.map((payment, index) => {
        if (manualEditRef.current.has(index)) return payment
        return {
          ...payment,
          cashOrderAmt: (couponRate / 100) * holdings[index]?.effectiveValueAmt
        }
      })
      setValue('couponPayments', updatedPayments)
    }
  }, [couponRate, holdings, couponPayments, setValue])

  // Memoize bank options to prevent recalculation
  const bankOptions = useMemo(() => 
    bankAccounts.map(b => ({ 
      label: b.displayName || `${b.bankName} - ${b.accountNumber}`, 
      value: b.bankAccountUid || b.id || ''
    })),
    [bankAccounts]
  )

  // Memoize calculateNetPayment function
  const calculateNetPayment = useCallback((effectiveValue: number): number => {
    if (!couponRate) return 0
    return (couponRate / 100) * effectiveValue
  }, [couponRate])

  // Handle bank account selection for a specific row - use useCallback
  const handleBankAccountChange = useCallback((index: number, bankAccountUid: string) => {
    const updatedPayments = [...couponPayments]
    updatedPayments[index] = {
      ...updatedPayments[index],
      bankAccountTo: bankAccountUid
    }
    setValue('couponPayments', updatedPayments)
    trigger(`couponPayments.${index}.bankAccountTo`)
  }, [couponPayments, setValue, trigger])

  // Handle manual Net Payment Amount change - use useCallback
  const handleNetPaymentChange = useCallback((index: number, value: number) => {
    // Mark this row as manually edited
    manualEditRef.current.add(index)
    
    const updatedPayments = [...couponPayments]
    
    updatedPayments[index] = {
      ...updatedPayments[index],
      cashOrderAmt: value
    }
    setValue('couponPayments', updatedPayments)
    
    // Auto-calculate and update coupon rate based on first row's net payment amount
    const effectiveValue = holdings[index]?.effectiveValueAmt || 0
    if (effectiveValue > 0 && value > 0) {
      const calculatedRate = (value / effectiveValue) * 100
      setValue('couponPercentageRate', Number(calculatedRate.toFixed(4)))
      
      // Clear manual edit flags for other rows so they get auto-filled with new rate
      const newManualEdits = new Set<number>()
      newManualEdits.add(index)
      manualEditRef.current = newManualEdits
    }
    
    // Auto-calculate total
    const total = updatedPayments.reduce((sum, p) => sum + (p.cashOrderAmt || 0), 0)
    setValue('totalCouponAmount', total)
    
    // Clear validation error for this field
    trigger(`couponPayments.${index}.cashOrderAmt`)
  }, [couponPayments, holdings, setValue, trigger])

  if (holdings.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
        Please select an ISIN to view holdings
      </div>
    )
  }

  return (
    <div className="coupon-table-container" style={{ marginTop: '20px' }}>
      <table className="coupon-payment-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f3f4f6', borderBottom: '2px solid #e5e7eb' }}>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>
              Client Name / Sub-org Name
            </th>
            <th style={{ padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: 600 }}>
              Bank Account (To) <span style={{ color: '#ef4444' }}>*</span>
            </th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>
              Value of Settled Holdings
            </th>
            <th style={{ padding: '12px', textAlign: 'right', fontSize: '13px', fontWeight: 600 }}>
              Net Payment Amount ({displayCurrency}) <span style={{ color: '#ef4444' }}>*</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding, index) => {
            const netPayment = calculateNetPayment(holding.effectiveValueAmt)
            const hasError = errors.couponPayments?.[index]

            return (
              <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                {/* Client Name / Sub-org */}
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 500, fontSize: '14px' }}>{holding.clientName}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    {holding.subOrganizationName}
                  </div>
                </td>

                {/* Bank Account */}
                <td style={{ padding: '12px', minWidth: '200px' }}>
                  <Controller
                    name={`couponPayments.${index}.bankAccountTo`}
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={bankOptions}
                        value={bankOptions.find(opt => opt.value === field.value) || null}
                        onChange={(opt) => handleBankAccountChange(index, opt?.value as string || '')}
                        isLoading={isLoadingBanks}
                        isClearable
                        placeholder="Select bank"
                        styles={getSelectStyles(!!hasError?.bankAccountTo)}
                        isDisabled={isDisabled}
                      />
                    )}
                  />
                  {hasError?.bankAccountTo && (
                    <span style={{ color: '#ef4444', fontSize: '12px' }}>
                      {hasError.bankAccountTo.message}
                    </span>
                  )}
                </td>

                {/* Value of Settled Holdings */}
                <td style={{ padding: '12px', textAlign: 'right', fontSize: '14px', fontWeight: 500 }}>
                  {holding.effectiveValueAmt.toLocaleString('en-US', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </td>

                {/* Net Payment Amount */}
                <td style={{ padding: '12px' }}>
                  <Controller
                    name={`couponPayments.${index}.cashOrderAmt`}
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        value={field.value ?? netPayment ?? 0}
                        onValueChange={(values) => {
                          const newValue = values.floatValue ?? 0
                          field.onChange(newValue)
                          handleNetPaymentChange(index, newValue)
                        }}
                        thousandSeparator=","
                        decimalSeparator="."
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        className={`form-table-input-field ${hasError?.cashOrderAmt ? 'error' : ''}`}
                        style={{ textAlign: 'right' }}
                        disabled={isDisabled}
                      />
                    )}
                  />
                  {hasError?.cashOrderAmt && (
                    <span style={{ color: '#ef4444', fontSize: '12px' }}>
                      {hasError.cashOrderAmt.message}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
