// TransactionTypeSelect.tsx
import { useFormContext, useController } from 'react-hook-form'
import Select from 'react-select'
import { getSelectStyles } from '@/constants/selectStyles' 
import type { TransactionFormValues } from '../../../types'

interface SelectOption {
  label: string
  value: string
}

interface Props {
  options: SelectOption[]
  onTypeChange?: (newValue: string) => void 
}

export function TransactionTypeSelect({ options, onTypeChange }: Props) {
  const { control, formState: { errors } } = useFormContext<TransactionFormValues>()

  const { field: { value, onChange, ref } } = useController({
    name: 'transactionType',
    control,
  })

  return (
    <div className="form-table-input">
      <Select
        ref={ref}
        options={options}
        // Tìm object option tương ứng với value hiện tại
        value={options.find((opt) => opt.value === value) || null} 
        onChange={(opt) => {
          const newValue = opt?.value || ''
          
          onChange(newValue) 

          if (onTypeChange) {
            onTypeChange(newValue)
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
      {errors.transactionType && (
        <span className="form-error">{errors.transactionType.message}</span>
      )}
    </div>
  )
}