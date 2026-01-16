import type { UseFormRegister, FieldError, FieldValues, Path } from 'react-hook-form'

interface FormFieldProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'url'
  placeholder?: string
  error?: FieldError
  disabled?: boolean
  required?: boolean
  register: UseFormRegister<TFieldValues>
  className?: string
  autoComplete?: string
  min?: number
  max?: number
  step?: number | string
}

export function FormField<TFieldValues extends FieldValues>({
  name,
  label,
  type = 'text',
  placeholder,
  error,
  disabled = false,
  required = false,
  register,
  className = '',
  autoComplete,
  min,
  max,
  step,
}: FormFieldProps<TFieldValues>) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-asterisk"> *</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${error ? 'error' : ''} ${className}`.trim()}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        {...register(name)}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  )
}
