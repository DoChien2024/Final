import type { UseFormRegister, FieldError, FieldValues, Path, RegisterOptions } from 'react-hook-form'

interface FormTextareaProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  placeholder?: string
  error?: FieldError
  disabled?: boolean
  required?: boolean
  register: UseFormRegister<TFieldValues>
  registerOptions?: RegisterOptions<TFieldValues, Path<TFieldValues>>
  rows?: number
  className?: string
  maxLength?: number
}

export function FormTextarea<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder,
  error,
  disabled = false,
  required = false,
  register,
  registerOptions,
  rows = 4,
  className = '',
  maxLength,
}: FormTextareaProps<TFieldValues>) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`form-input ${error ? 'error' : ''} ${className}`.trim()}
        {...register(name, registerOptions)}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  )
}
