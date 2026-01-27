import { useFormContext, useController } from 'react-hook-form' // Import thêm useController
import { FiUpload, FiFile, FiX, FiChevronDown } from 'react-icons/fi'
import type { TransactionFormValues } from '../../types'

interface Props {
  defaultOpen?: boolean
}

export function DocumentAttachmentForm({ defaultOpen = true }: Props) {
  const { control } = useFormContext<TransactionFormValues>()

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
    if (validFiles.length) {
      onChange([...files, ...validFiles])
    }
  }

  const removeFile = (indexToRemove: number) => {
    onChange(files.filter((_, index) => index !== indexToRemove))
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