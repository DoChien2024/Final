import { useFormContext, Controller } from 'react-hook-form'
import { FiLock, FiInfo } from 'react-icons/fi'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import { NumericFormat } from 'react-number-format'
import { getSelectStyles } from '@/constants/selectStyles'
import type { TransactionFormValues, TransactionOptions, LoadingStates } from '../../types'
import type { FieldVisibility } from '../../constants'

interface Props {
  options: TransactionOptions
  loadingStates: LoadingStates
  fieldVisibility: FieldVisibility
  minDate: Date
  maxDate: Date
  watchedValues: { clientName: string }
}

export function TransactionFormDebit({ options, loadingStates, fieldVisibility, minDate, maxDate, watchedValues }: Props) {
  const { control, formState: { errors } } = useFormContext<TransactionFormValues>()

  const orgOptions = options.orgs.map(org => ({ label: org.name, value: org.id }))
  const subOrgOptions = options.subOrgs.map(sub => ({ label: sub.name, value: sub.subOrgId || sub.id || '' }))
  const currencyOptions = options.currencies.map(c => 
    typeof c === 'string' ? { label: c, value: c } : { label: `${c.code} - ${c.name}`, value: c.code }
  )
  const bankOptions = options.bankAccounts.map(b => ({ 
    label: b.displayName || `${b.bankName} - ${b.accountNumber}`, 
    value: b.bankAccountUid || b.id || ''
  }))

  const bankLabel = fieldVisibility.bankDirection === 'from' ? 'Bank Details (From)' : 'Bank Account'

  return (
    <>
      {/* Client Name */}
      {fieldVisibility.showClientFields && (
        <div className="form-table-row">
          <label className="form-table-label">Client Name</label>
          <div className="form-table-input">
            <Controller
              name="clientName"
              control={control}
              render={({ field }) => (
                <Select
                  options={orgOptions}
                  value={orgOptions.find(opt => opt.value === field.value) || null}
                  onChange={(opt) => field.onChange(opt?.value || '')}
                  placeholder="Select"
                  isClearable
                  isSearchable
                  isDisabled={loadingStates.orgs}
                  styles={getSelectStyles(!!errors.clientName)}
                  className="form-table-select"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              )}
            />
          </div>
        </div>
      )}

      {/* Sub-Org Name */}
      {fieldVisibility.showClientFields && (
        <div className="form-table-row">
          <label className="form-table-label">Sub-Org Name</label>
          <div className="form-table-input with-lock">
            <Controller
              name="subOrgName"
              control={control}
              render={({ field }) => (
                <Select
                  options={subOrgOptions}
                  value={subOrgOptions.find(opt => opt.value === field.value) || null}
                  onChange={(opt) => field.onChange(opt?.value || '')}
                  placeholder="Select"
                  isClearable
                  isSearchable
                  isDisabled={!watchedValues.clientName || loadingStates.subOrgs}
                  styles={getSelectStyles(!!errors.subOrgName)}
                  className="form-table-select"
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              )}
            />
            {!watchedValues.clientName && <span className="lock-icon"><FiLock size={14} /></span>}
          </div>
        </div>
      )}

      {/* Transaction ID */}
      <div className="form-table-row">
        <label className="form-table-label">Transaction ID</label>
        <div className="form-table-input">
          <span className="form-value-text">-</span>
        </div>
      </div>

      {/* Currency */}
      <div className="form-table-row">
        <label className="form-table-label">Currency <span className="required-asterisk">*</span></label>
        <div className="form-table-input">
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Select
                options={currencyOptions}
                value={currencyOptions.find(opt => opt.value === field.value) || null}
                onChange={(opt) => field.onChange(opt?.value || '')}
                placeholder="Select"
                isClearable
                isSearchable
                isDisabled={loadingStates.currencies}
                styles={getSelectStyles(!!errors.currency)}
                className="form-table-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            )}
          />
          {errors.currency && <span className="form-error">{errors.currency.message}</span>}
        </div>
      </div>

      {/* Amount */}
      <div className="form-table-row">
        <label className="form-table-label">Amount <span className="required-asterisk">*</span></label>
        <div className="form-table-input">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <NumericFormat
                value={field.value}
                onValueChange={(values) => field.onChange(values.floatValue || 0)}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                className={`form-table-input-field ${errors.amount ? 'error' : ''}`}
                placeholder="0.00"
              />
            )}
          />
          {errors.amount && <span className="form-error">{errors.amount.message}</span>}
        </div>
      </div>

      {/* Fees */}
      {fieldVisibility.showFees && (
        <div className="form-table-row">
          <label className="form-table-label">
            Fees <span className="tooltip-icon" title="Transaction fees"><FiInfo size={14} /></span>
          </label>
          <div className="form-table-input">
            <Controller
              name="fees"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value ?? ''}
                  onValueChange={(values) => field.onChange(values.floatValue ?? null)}
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  className="form-table-input-field"
                  placeholder="0.00"
                />
              )}
            />
          </div>
        </div>
      )}

      {/* GST Amount */}
      {fieldVisibility.showGstAmount && (
        <div className="form-table-row">
          <label className="form-table-label">
            GST Amount <span className="tooltip-icon" title="Tax Withholding"><FiInfo size={14} /></span>
          </label>
          <div className="form-table-input">
            <Controller
              name="gstAmount"
              control={control}
              render={({ field }) => (
                <NumericFormat
                  value={field.value ?? ''}
                  onValueChange={(values) => field.onChange(values.floatValue ?? null)}
                  thousandSeparator=","
                  decimalSeparator="."
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  className="form-table-input-field"
                  placeholder="0.00"
                />
              )}
            />
          </div>
        </div>
      )}

      {/* Effective Date */}
      <div className="form-table-row">
        <label className="form-table-label">Effective Date <span className="required-asterisk">*</span></label>
        <div className="form-table-input">
          <Controller
            name="effectiveDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date: Date | null) => field.onChange(date)}
                dateFormat="dd MMM yyyy"
                minDate={minDate}
                maxDate={maxDate}
                className={`form-table-input-field date-field ${errors.effectiveDate ? 'error' : ''}`}
                wrapperClassName="datepicker-inline"
              />
            )}
          />
          {errors.effectiveDate && <span className="form-error">{errors.effectiveDate.message}</span>}
        </div>
      </div>

      {/* Bank Details */}
      <div className="form-table-row">
        <label className="form-table-label">{bankLabel}</label>
        <div className="form-table-input">
          <Controller
            name="bankAccount"
            control={control}
            render={({ field }) => (
              <Select
                options={bankOptions}
                value={bankOptions.find(opt => opt.value === field.value) || null}
                onChange={(opt) => field.onChange(opt?.value || '')}
                placeholder="Select"
                isClearable
                isSearchable
                isDisabled={loadingStates.bankAccounts}
                styles={getSelectStyles(!!errors.bankAccount)}
                className="form-table-select"
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            )}
          />
        </div>
      </div>

      {/* Description */}
      <div className="form-table-row">
        <label className="form-table-label">Description <span className="required-asterisk">*</span></label>
        <div className="form-table-input full-width">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className={`form-table-input-field full ${errors.description ? 'error' : ''}`}
                disabled={!fieldVisibility.descriptionEditable}
              />
            )}
          />
          {errors.description && <span className="form-error">{errors.description.message}</span>}
        </div>
      </div>

      {/* Created Date */}
      <div className="form-table-row">
        <label className="form-table-label">Created Date <span className="required-asterisk">*</span></label>
        <div className="form-table-input">
          <Controller
            name="createdDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value ? new Date(field.value) : null}
                onChange={(date: Date | null) => field.onChange(date)}
                dateFormat="dd MMM yyyy"
                className="form-table-input-field date-field disabled"
                wrapperClassName="datepicker-inline"
                disabled
              />
            )}
          />
        </div>
      </div>
    </>
  )
}
