import { useFormContext, Controller } from 'react-hook-form'
import { FiChevronDown } from 'react-icons/fi'
import type { TransactionFormValues } from '../../types'
import { useTransactionFormContext } from '../../context/TransactionFormContext'

interface Props {
  defaultOpen?: boolean
}

const READONLY_CONTAINER_STYLE = {
  padding: '16px 20px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  marginBottom: '12px'
} as const

const LABEL_STYLE = {
  fontWeight: '500',
  color: '#374151',
  minWidth: '180px',
  flexShrink: 0
} as const

export function InternalCommentsForm({ defaultOpen = true }: Props) {
  const { control, getValues } = useFormContext<TransactionFormValues>()
  const { mode } = useTransactionFormContext()
  const isReadOnly = !!mode

  if (isReadOnly) {
    const comments = getValues('internalComments')
    return (
      <div style={READONLY_CONTAINER_STYLE}>
        <div style={{ 
          display: 'flex',
          gap: '40px',
          alignItems: comments ? 'flex-start' : 'center',
          flexWrap: 'wrap'
        }}>
          <span style={LABEL_STYLE}>Internal Comments</span>
          <span style={{ 
            flex: 1,
            minWidth: '200px',
            color: comments ? '#4b5563' : '#6b7280',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {comments || '-'}
          </span>
        </div>
      </div>
    )
  }

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
