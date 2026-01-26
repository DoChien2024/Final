import { Controller, type Control, type FieldValues, type Path, type FieldError } from 'react-hook-form'
import Select, { type Props as SelectProps } from 'react-select'
import { getSelectStyles, type SelectOption } from '@/constants/selectStyles'

interface FormSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>
  label: string
  control: Control<TFieldValues>
  options: SelectOption[]
  error?: FieldError
  disabled?: boolean
  required?: boolean
  placeholder?: string
  isClearable?: boolean
  isSearchable?: boolean
  className?: string
  selectProps?: Partial<SelectProps<SelectOption, false>>
}

export function FormSelect<TFieldValues extends FieldValues>({
  name,
  label,
  control,
  options,
  error,
  disabled = false,
  required = false,
  placeholder = 'Select...',
  isClearable = true,
  isSearchable = true,
  className = '',
  selectProps = {},
}: FormSelectProps<TFieldValues>) {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="required-asterisk"> *</span>}
      </label>
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? 'This field is required.' : false,
        }}
        // schema
        render={({ field }) => (
          <Select
            {...field}
            inputId={name}
            options={options}
            value={options.find(option => option.value === field.value) || null}
            onChange={(option) => field.onChange(option?.value || '')}
            onBlur={field.onBlur}
            placeholder={placeholder}
            isClearable={isClearable}
            isSearchable={isSearchable}
            isDisabled={disabled}
            styles={getSelectStyles(!!error)}
            className={className}
            {...selectProps}
          />
        )}
      />
      {error && <span className="error-message">{error.message}</span>}
    </div>
  )
}
