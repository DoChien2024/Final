import { useFormContext, useController } from 'react-hook-form'
import { FiUpload, FiFile, FiX, FiChevronDown } from 'react-icons/fi'
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

export function DocumentAttachmentForm({ defaultOpen = true }: Props) {
  const { control } = useFormContext<TransactionFormValues>()
  const { mode } = useTransactionFormContext()
  const isReadOnly = !!mode

  const { field: { value: files = [], onChange } } = useController({
    name: 'supportingDocs',
    control,
    defaultValue: []
  })

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
  }

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return
    const validFiles = Array.from(fileList).filter(validateFile)
    if (validFiles.length) onChange([...files, ...validFiles])
  }

  const removeFile = (indexToRemove: number) => {
    onChange(files.filter((_, index) => index !== indexToRemove))
  }

  if (isReadOnly) {
    return (
      <div style={READONLY_CONTAINER_STYLE}>
        <div style={{ 
          display: 'flex',
          gap: '40px',
          alignItems: files.length > 0 ? 'flex-start' : 'center',
          flexWrap: 'wrap'
        }}>
          <span style={LABEL_STYLE}>Document Attachment</span>
          {files.length > 0 ? (
            <div style={{ flex: 1, minWidth: '200px' }}>
              {files.map((file: File, index: number) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: index < files.length - 1 ? '8px' : '0',
                  color: '#4b5563'
                }}>
                  <FiFile style={{ flexShrink: 0 }} />
                  <span style={{ wordBreak: 'break-word' }}>{file.name}</span>
                  <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>({(file.size / 1024).toFixed(1)} KB)</span>
                </div>
              ))}
            </div>
          ) : (
            <span style={{ color: '#6b7280' }}>-</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <details className="form-section-collapsible" open={defaultOpen}>
      <summary className="section-header">
        <span className="section-title">Document Attachment</span>
        <FiChevronDown className="collapse-icon" />
      </summary>
      <div className="section-content">
        <div
          className="file-upload-zone"
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
          onDrop={(e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
            handleFiles(e.dataTransfer.files) 
          }}
        >
          <label htmlFor="file-upload" className="file-upload-label">
            <FiUpload className="upload-icon" />
            <p className="upload-text">Drag and drop your files here or <span className="browse-link">Browse Files</span></p>
            <p className="upload-hint">PDF, DOC, DOCX (Max 5MB)</p>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={(e) => { 
              handleFiles(e.target.files); 
              e.target.value = '' 
            }}
            hidden
          />
        </div>

        {files.length > 0 && (
          <div className="file-list">
            {files.map((file: File, index: number) => (
              <div key={index} className="file-item">
                <FiFile className="file-icon" />
                <span className="file-name">{file.name}</span>
                <span className="file-size">{(file.size / 1024).toFixed(1)} KB</span>
                <button type="button" onClick={() => removeFile(index)} className="file-remove">
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </details>
  )
}