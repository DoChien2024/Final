// TransactionDetailsForm.tsx
import { useFormContext } from 'react-hook-form'
import { FiChevronDown } from 'react-icons/fi'
import { TRANSACTION_STATUSES, type FieldVisibility, type TransactionType } from '../../constants'
import type { TransactionFormValues, TransactionOptions, LoadingStates } from '../../types'
import { TransactionFormDebit } from '../modal/TransactionFormDebit'
import { TransactionFormCredit } from '../modal/TransactionFormCredit'
import { StatusButtons } from '../form/share/StatusButtons'
// Import component mới tách
import { TransactionTypeSelect } from '../form/share/TransactionTypeSelect'

interface SelectOption {
  label: string
  value: string
}

interface Props {
  transactionTypeOptions: SelectOption[]
  options: TransactionOptions
  loadingStates: LoadingStates
  fieldVisibility: FieldVisibility
  minDate: Date
  maxDate: Date
  watchedValues: {
    transactionType: string
    clientName: string
    currency: string
  }
  showAllFields: boolean
  type: 'Debit' | 'Credit'
}

export function TransactionDetailsForm({
  transactionTypeOptions,
  options,
  loadingStates,
  fieldVisibility,
  minDate,
  maxDate,
  watchedValues,
  showAllFields,
  type,
}: Props) {
  const { reset, getValues } = useFormContext<TransactionFormValues>()

  // Logic xử lý khi đổi loại giao dịch
  const handleTransactionTypeChange = (newValue: string) => {
    const currentType = getValues('transactionType');
    if (newValue === currentType) return;

    const newTypeTyped = newValue as TransactionType | ''

    reset({
        transactionType: newTypeTyped,
        clientName: '',
        subOrgName: '',
        currency: '',
        amount: null,
        fees: null,
        gstAmount: null,
        bankCharges: null,
        effectiveDate: new Date(),
        bankAccount: '',
        description: '',
    })
  }

  const renderFormFields = () => {
    if (!showAllFields) return null

    if (type === 'Debit') {
      return (
        <TransactionFormDebit
          options={options}
          loadingStates={loadingStates}
          fieldVisibility={fieldVisibility}
          minDate={minDate}
          maxDate={maxDate}
          watchedValues={{ clientName: watchedValues.clientName }}
        />
      )
    }
    return (
      <TransactionFormCredit
        options={options}
        loadingStates={loadingStates}
        fieldVisibility={fieldVisibility}
        minDate={minDate}
        maxDate={maxDate}
      />
    )
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
            
            <TransactionTypeSelect 
              options={transactionTypeOptions}
              onTypeChange={handleTransactionTypeChange}
            />
            
          </div>

          {/* Transaction Status */}
          <div className="form-table-row">
            <label className="form-table-label">Transaction Status</label>
            <div className="form-table-input">
              <StatusButtons statuses={TRANSACTION_STATUSES} />
            </div>
          </div>

          {/* Form fields based on type */}
          {renderFormFields()}
        </div>
      </div>
    </details>
  )
}