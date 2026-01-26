import { Controller, type Control, type FieldValues, type Path, type FieldError } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import { FiCalendar } from 'react-icons/fi'
import 'react-datepicker/dist/react-datepicker.css'

interface FormDatePickerProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  control: Control<TFieldValues>
  error?: FieldError
  disabled?: boolean
  required?: boolean
  placeholder?: string
  showTimeSelect?: boolean
  dateFormat?: string
  minDate?: Date
  maxDate?: Date
  className?: string
}

export function FormDatePicker<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  error,
  disabled = false,
  required = false,
  placeholder = 'Select date',
  showTimeSelect = false,
  dateFormat = 'dd MMM yyyy',
  minDate,
  maxDate,
  className = '',
}: FormDatePickerProps<TFieldValues>) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="date-picker-wrapper">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <DatePicker
              id={name}
              selected={field.value ? new Date(field.value) : null}
              onChange={(date: Date | null) => field.onChange(date?.toISOString() || '')}
              onBlur={field.onBlur}
              placeholderText={placeholder}
              disabled={disabled}
              showTimeSelect={showTimeSelect}
              dateFormat={dateFormat}
              minDate={minDate}
              maxDate={maxDate}
              className={`form-input ${error ? 'error' : ''} ${className}`.trim()}
              wrapperClassName="w-full"
            />
          )}
        />
        <FiCalendar className="date-picker-icon" />
      </div>
      {error && <span className="error-message">{error.message}</span>}
    </div>
  )
}
