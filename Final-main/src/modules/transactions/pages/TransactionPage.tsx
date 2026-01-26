import { useState } from 'react'
import { FormProvider } from 'react-hook-form'
import { FiChevronDown, FiX, FiInfo } from 'react-icons/fi'
import { useTransactionForm } from '../hooks'
import { TransactionFormFields } from '../components'
import type { TransactionCategory } from '../constants'
import Toast from '@/components/ui/Toast'

export default function TransactionPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: TransactionCategory | null
  }>({
    isOpen: false,
    type: null,
  })

  // Close modal handler
  const handleCloseModal = () => {
    setModalState({ isOpen: false, type: null })
  }

  // Handle dropdown toggle
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  // Handle create transaction
  const handleCreateClick = (type: TransactionCategory) => {
    setModalState({ isOpen: true, type })
    setIsDropdownOpen(false)
  }

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Transactions</h1>
          <div className="page-actions">
            {/* Dropdown Create Button */}
            <div className="dropdown-container" style={{ position: 'relative' }}>
              <button
                onClick={toggleDropdown}
                className="btn-primary dropdown-toggle"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Create Transaction
                <FiChevronDown 
                  style={{ 
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }} 
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    onClick={() => setIsDropdownOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 999 }}
                  />
                  <div
                    className="dropdown-menu"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '4px',
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      minWidth: '200px',
                      zIndex: 1000,
                    }}
                  >
                    {(['debit', 'credit'] as TransactionCategory[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleCreateClick(type)}
                        className="dropdown-item"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          textAlign: 'left',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          textTransform: 'capitalize',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Table - Placeholder */}
        <div className="content-section">
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
            Transaction list will be displayed here
          </p>
        </div>
      </div>

      {/* Transaction Form Modal */}
      {modalState.isOpen && modalState.type && (
        <TransactionFormModal 
          type={modalState.type} 
          onClose={handleCloseModal} 
        />
      )}
      <Toast />
    </>
  )
}

// ==================== TRANSACTION FORM MODAL ====================
function TransactionFormModal({ 
  type, 
  onClose 
}: { 
  type: TransactionCategory
  onClose: () => void 
}) {
  const {
    form,
    handleSubmit,
    transactionTypeOptions,
    options,
    loadingStates,
    fieldVisibility,
    minDate,
    maxDate,
    watchedValues,
    onSaveAndClose,
    handleClose,
  } = useTransactionForm({ category: type, onClose })

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div 
        className="modal-container-fullscreen" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            Create Transaction - {type === 'debit' ? 'Debit' : 'Credit'}
          </h2>
          <button onClick={handleClose} className="modal-close-btn">
            <FiX />
          </button>
        </div>

        {/* Form with FormProvider */}
        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="modal-form-fullscreen">
            {/* Info Banner */}
            <div className="info-banner">
              <FiInfo className="info-icon" />
              <p className="info-message">
                This transaction is in <strong>Draft</strong> status. Please update the transaction details before submitting it to Checker. Once approved by Checker, the status will change to <strong>Completed</strong>.
              </p>
            </div>

            <TransactionFormFields
              transactionTypeOptions={transactionTypeOptions}
              options={options}
              loadingStates={loadingStates}
              fieldVisibility={fieldVisibility}
              minDate={minDate}
              maxDate={maxDate}
              watchedValues={watchedValues}
              type={type === 'debit' ? 'Debit' : 'Credit'}
            />

            {/* Footer Buttons */}
            <div className="modal-footer-fixed">
              <button type="button" onClick={handleClose} className="btn-outline">
                Close
              </button>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={onSaveAndClose} className="btn-secondary">
                  Save And Close
                </button>
                <button type="submit" className="btn-primary">
                  Save And Submit
                </button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  )
}