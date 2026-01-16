import { UseFormRegister, FieldError, FieldValues, Path } from 'react-hook-form'

interface FormNumberInputProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  placeholder?: string
  register: UseFormRegister<TFieldValues>
  error?: FieldError
  disabled?: boolean
  required?: boolean
  min?: number
  step?: number
  allowDecimals?: boolean
  suffix?: string
  maxValue?: number
  customValidate?: (value: number) => string | true
}

export function FormNumberInput<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder = '',
  register,
  error,
  disabled = false,
  required = false,
  min = 0.01,
  step = 0.01,
  allowDecimals = true,
  suffix,
  maxValue,
  customValidate,
}: FormNumberInputProps<TFieldValues>) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Chặn các ký tự không hợp lệ
    const invalidKeys = ['', '', '+', '-']
    if (!allowDecimals) {
      invalidKeys.push('.', ',')
    }
    if (invalidKeys.includes(e.key)) {
      e.preventDefault()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('text')
    const pattern = allowDecimals ? /^\d*\.?\d*$/ : /^\d+$/
    if (!pattern.test(pastedData)) {
      e.preventDefault()
    }
  }

  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-asterisk"> *</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          id={name}
          {...register(name, {
            setValueAs: (v) => {
              const val = v === '' || v === null || v === undefined ? undefined : Number(v)
              return val
            },
            validate: (value) => {
              // Allow undefined for non-required fields or when field is empty
              if (value === undefined || value === null || value === '') {
                return required ? 'This field is required.' : true
              }
              const numValue = Number(value)
              if (isNaN(numValue)) return 'Please enter a valid number'
              if (min !== undefined && numValue < min) return `${label} must be at least ${min}`
              if (maxValue && numValue > maxValue) return `${label} cannot exceed ${maxValue}`
              if (!allowDecimals && !Number.isInteger(numValue)) return `${label} must be a whole number`
              if (customValidate) return customValidate(numValue)
              return true
            }
          })}
          placeholder={placeholder}
          step={allowDecimals ? step : 1}
          min={min}
          disabled={disabled}
          className={`form-input ${error ? 'error' : ''}`}
          style={suffix ? { paddingRight: '40px' } : undefined}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        {suffix && (
          <span
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              color: '#424242',
              fontWeight: 500,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  )
}
