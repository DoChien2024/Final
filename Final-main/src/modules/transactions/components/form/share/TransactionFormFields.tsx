import { Controller, useFormContext } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import DatePicker from 'react-datepicker'

// ============================================================================
// TransactionCurrencyField
// ============================================================================

interface TransactionCurrencyFieldProps {
  name: string
  label: string
  required?: boolean
  tooltip?: string
  disabled?: boolean
  placeholder?: string
}

export function TransactionCurrencyField({
  name,
  label,
  required = false,
  tooltip,
  disabled = false,
  placeholder = '0.00',
}: TransactionCurrencyFieldProps) {
  const { control, formState: { errors } } = useFormContext()
  
  // Get nested error if exists
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  return (
    <div className="form-table-row">
      <label className="form-table-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
        {tooltip && (
          <span className="tooltip-icon" title={tooltip}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </span>
        )}
      </label>
      <div className="form-table-input">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <NumericFormat
              value={field.value ?? (required ? 0 : '')}
              onValueChange={(values) => field.onChange(values.floatValue ?? (required ? 0 : null))}
              thousandSeparator=","
              decimalSeparator="."
              decimalScale={2}
              fixedDecimalScale
              allowNegative={false}
              disabled={disabled}
              className={`form-table-input-field ${error ? 'error' : ''}`}
              placeholder={placeholder}
            />
          )}
        />
        {error && <span className="form-error">{error.message}</span>}
      </div>
    </div>
  )
}

// ============================================================================
// TransactionDateField
// ============================================================================

interface TransactionDateFieldProps {
  name: string
  label: string
  required?: boolean
  disabled?: boolean
  minDate?: Date
  maxDate?: Date
  dateFormat?: string
}

/**
 * Date field wrapper specifically for transaction table layout
 * Uses useFormContext to avoid prop drilling
 */
export function TransactionDateField({
  name,
  label,
  required = false,
  disabled = false,
  minDate,
  maxDate,
  dateFormat = 'dd MMM yyyy',
}: TransactionDateFieldProps) {
  const { control, formState: { errors } } = useFormContext()
  
  // Get nested error if exists
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  return (
    <div className="form-table-row">
      <label className="form-table-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div className="form-table-input">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={field.value ? new Date(field.value) : null}
              onChange={(date: Date | null) => field.onChange(date)}
              dateFormat={dateFormat}
              minDate={minDate}
              maxDate={maxDate}
              disabled={disabled}
              className={`form-table-input-field date-field ${disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}
              wrapperClassName="datepicker-inline"
            />
          )}
        />
        {error && <span className="form-error">{error.message}</span>}
      </div>
    </div>
  )
}

// ============================================================================
// TransactionPercentageField
// ============================================================================

interface TransactionPercentageFieldProps {
  name: string
  label: string
  required?: boolean
  tooltip?: string
  disabled?: boolean
  placeholder?: string
  onChange?: (value: number | null) => void
}

export function TransactionPercentageField({
  name,
  label,
  required = false,
  tooltip,
  disabled = false,
  placeholder = '0.00',
  onChange: onChangeCallback,
}: TransactionPercentageFieldProps) {
  const { control, formState: { errors } } = useFormContext()
  
  // Get nested error if exists
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  return (
    <div className="form-table-row">
      <label className="form-table-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
        {tooltip && (
          <span className="tooltip-icon" title={tooltip}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01"/>
            </svg>
          </span>
        )}
      </label>
      <div className="form-table-input">
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <NumericFormat
                value={field.value ?? ''}
                onValueChange={(values) => {
                  const newValue = values.floatValue ?? null
                  field.onChange(newValue)
                  onChangeCallback?.(newValue)
                }}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                disabled={disabled}
                className={`form-table-input-field ${error ? 'error' : ''}`}
                placeholder={placeholder}
                style={{ paddingRight: '30px' }}
              />
            )}
          />
          <span style={{ 
            position: 'absolute', 
            right: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            %
          </span>
        </div>
        {error && <span className="form-error">{error.message}</span>}
      </div>
    </div>
  )
}

// ============================================================================
// TransactionTextField
// ============================================================================

interface TransactionTextFieldProps {
  name: string
  label: string
  required?: boolean
  disabled?: boolean
  placeholder?: string
  fullWidth?: boolean
}

export function TransactionTextField({
  name,
  label,
  required = false,
  disabled = false,
  placeholder = '',
  fullWidth = false,
}: TransactionTextFieldProps) {
  const { control, formState: { errors } } = useFormContext()
  
  // Get nested error if exists
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  return (
    <div className="form-table-row">
      <label className="form-table-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div className={`form-table-input ${fullWidth ? 'full-width' : ''}`}>
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <input
              {...field}
              value={field.value ?? ''}
              type="text"
              className={`form-table-input-field ${fullWidth ? 'full' : ''} ${error ? 'error' : ''}`}
              disabled={disabled}
              placeholder={placeholder}
            />
          )}
        />
        {error && <span className="form-error">{error.message}</span>}
      </div>
    </div>
  )
}
