import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form'
import Select from 'react-select'
import { getSelectStyles } from '@/constants/selectStyles'

interface Option {
  label: string
  value: string
}

interface SelectControllerProps<T extends FieldValues = any> {
  name: Path<T>
  options: Option[]
  placeholder?: string
  disabled?: boolean
  isLoading?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  extendOnChange?: (value: string | null) => void
}

export const SelectController = <T extends FieldValues = any>({
  name,
  options,
  placeholder = 'Select',
  disabled = false,
  isLoading = false,
  isClearable = true,
  isSearchable = true,
  extendOnChange,
}: SelectControllerProps<T>) => {
  const { control, formState: { errors } } = useFormContext<T>()
  
  // Get nested error if exists
  const error = name.split('.').reduce((obj: any, key) => obj?.[key], errors)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          options={options}
          value={options.find(opt => opt.value === field.value) || null}
          onChange={(opt) => {
            const value = opt?.value || ''
            field.onChange(value)
            extendOnChange?.(value || null)
          }}
          placeholder={placeholder}
          isClearable={isClearable}
          isSearchable={isSearchable}
          isDisabled={disabled || isLoading}
          isLoading={isLoading}
          styles={getSelectStyles(!!error)}
          className="form-table-select"
          menuPortalTarget={document.body}
          menuPosition="fixed"
        />
      )}
    />
  )
}
