import { useFormContext, Controller } from 'react-hook-form'
import { FiChevronDown } from 'react-icons/fi'
import Select from 'react-select'
import { getSelectStyles } from '@/constants/selectStyles'
import { TRANSACTION_STATUSES, type FieldVisibility, type TransactionType } from '../../constants'
import type { TransactionFormValues, TransactionOptions, LoadingStates } from '../../types'
import { TransactionFormDebit } from '../modal/TransactionFormDebit'
import { TransactionFormCredit } from '../modal/TransactionFormCredit'

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

// Status Buttons
function StatusButtons() {
  const { setValue, watch } = useFormContext<TransactionFormValues>()
  const currentStatus = watch('status')

  return (
    <div className="status-buttons-row">
      {TRANSACTION_STATUSES.map((status) => (
        <button
          key={status}
          type="button"
          className={`status-btn-pill ${currentStatus === status ? 'active' : ''} status-${status.toLowerCase()}`}
          onClick={() => setValue('status', status)}
        >
          {status}
        </button>
      ))}
    </div>
  )
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
  const { control, formState: { errors }, reset } = useFormContext<TransactionFormValues>()

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
            <div className="form-table-input">
              <Controller
                name="transactionType"
                control={control}
                render={({ field }) => (
                  <Select
                    options={transactionTypeOptions}
                    value={transactionTypeOptions.find(opt => opt.value === field.value) || null}
                    onChange={(opt) => {
                      const newValue = (opt?.value || '') as TransactionType | ''
                      if (newValue !== field.value) {
                        reset({
                          transactionType: newValue,
                          status: 'Draft',
                          clientName: '',
                          subOrgName: '',
                          currency: '',
                          amount: 0,
                          fees: null,
                          gstAmount: null,
                          bankCharges: null,
                          effectiveDate: new Date(),
                          bankAccount: '',
                          description: '',
                          createdDate: new Date(),
                        })
                      }
                    }}
                    placeholder="Select"
                    isClearable
                    isSearchable
                    styles={getSelectStyles(!!errors.transactionType)}
                    className="form-table-select"
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                  />
                )}
              />
              {errors.transactionType && <span className="form-error">{errors.transactionType.message}</span>}
            </div>
          </div>

          {/* Transaction Status */}
          <div className="form-table-row">
            <label className="form-table-label">Transaction Status</label>
            <div className="form-table-input">
              <StatusButtons />
            </div>
          </div>

          {/* Form fields based on type */}
          {renderFormFields()}
        </div>
      </div>
    </details>
  )
}
