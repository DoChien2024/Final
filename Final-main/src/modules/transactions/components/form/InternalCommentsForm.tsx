import { useFormContext, Controller } from 'react-hook-form'
import { FiChevronDown } from 'react-icons/fi'
import type { TransactionFormValues } from '../../types'

interface Props {
  defaultOpen?: boolean
}

export function InternalCommentsForm({ defaultOpen = true }: Props) {
  const { control } = useFormContext<TransactionFormValues>()

  return (
    <details className="form-section-collapsible" open={defaultOpen}>
      <summary className="section-header">
        <span className="section-title">Internal Comments</span>
        <FiChevronDown className="collapse-icon" />
      </summary>
      <div className="section-content">
        <Controller
          name="internalComments"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              className="form-textarea"
              placeholder="Add internal comments..."
              rows={4}
            />
          )}
        />
        <p className="form-hint">
          Comments will be saved when the request is <strong>approved</strong> or <strong>rejected</strong>.
        </p>
      </div>
    </details>
  )
}
