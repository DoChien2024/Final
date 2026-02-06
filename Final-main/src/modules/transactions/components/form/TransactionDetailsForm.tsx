// TransactionDetailsForm.tsx
import { FiChevronDown } from 'react-icons/fi'
import { useFormContext } from 'react-hook-form'
import { useTransactionFormContext } from '../../context/TransactionFormContext'
import { TransactionFormUnified } from './TransactionFormUnified'
import { TransactionFormCoupon } from './TransactionFormCoupon'
import { StatusButtons } from './share/StatusButtons'
import { SelectController } from './share/SelectController'
import type { TransactionFormValues } from '../../types'

export function TransactionDetailsForm() {
  const { 
    transactionTypeOptions, 
    transactionStatusOptions,
    transactionType,
    onChange
  } = useTransactionFormContext()
  
  const { formState: { errors } } = useFormContext<TransactionFormValues>()

  const showAllFields = !!transactionType

  // Use onChange handler from hook
  const handleTransactionTypeChange = (newValue: string | null) => {
    if (!newValue) return
    onChange.transactionType(newValue)
  }

  const renderFormFields = () => {
    if (!showAllFields) return null

    // Check if Coupon Payment
    if (transactionType === 'Coupon Payment') {
      return <TransactionFormCoupon />
    }

    // Use unified form for both Debit and Credit
    return <TransactionFormUnified />
  }
  
  return (
    <details className="form-section-collapsible" open>
      <summary className="section-header">
        <span className="section-title">Transaction Details</span>
        <FiChevronDown className="collapse-icon" />
      </summary>
      <div className="section-content">
        <div className="form-table">
          {/* Transaction Type */}
          <div className="form-table-row">
            <label className="form-table-label">
              Transaction Type <span className="required-asterisk">*</span>
            </label>
            <div className="form-table-input">
              <SelectController
                name="transactionType"
                options={transactionTypeOptions}
                extendOnChange={handleTransactionTypeChange}
              />
              {errors.transactionType && <span className="form-error">{errors.transactionType.message}</span>}
            </div>
          </div>

          {/* Transaction Status */}
          <div className="form-table-row">
            <label className="form-table-label">
              Transaction Status <span className="required-asterisk">*</span>
            </label>
            <div className="form-table-input">
              <StatusButtons 
                statuses={transactionStatusOptions.map(s => s.value)} 
              />
              {errors.status && <span className="form-error">{errors.status.message}</span>}
            </div>
          </div>
          {showAllFields && (
            <>
              {renderFormFields()}
            </>
          )}
        </div>
      </div>
    </details>
  )
}