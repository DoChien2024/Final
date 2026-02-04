import { useFormContext } from 'react-hook-form'
import { format } from 'date-fns'
import type { TransactionFormValues } from '../../types'

interface ReadOnlyFieldProps {
  name: keyof TransactionFormValues
  label: string
  type?: 'text' | 'number' | 'currency' | 'date' | 'select'
  options?: Array<{ label: string; value: string }>
}

export function ReadOnlyField({ name, label, type = 'text', options }: ReadOnlyFieldProps) {
  const { getValues } = useFormContext<TransactionFormValues>()
  const value = getValues(name as any)

  const formatValue = () => {
    if (value === null || value === undefined || value === '') return '-'

    switch (type) {
      case 'currency':
        if (typeof value === 'number') {
          return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(value)
        }
        return '-'

      case 'date':
        try {
          return format(new Date(value as any), 'dd/MM/yyyy')
        } catch {
          return '-'
        }

      case 'select':
        if (options) {
          const option = options.find(opt => opt.value === value)
          return option ? option.label : String(value)
        }
        return String(value)

      default:
        return String(value)
    }
  }

  return (
    <div className="form-table-row">
      <label className="form-table-label">{label}</label>
      <div className="form-table-input">
        <span className="form-value-text">{formatValue()}</span>
      </div>
    </div>
  )
}
