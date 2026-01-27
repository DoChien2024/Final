import { useState } from 'react'
import { TransactionToolbar } from './form/share/TransactionToolbar'
import { TransactionFormModal } from './index'
import type { TransactionCategory } from '../constants'
import Toast from '@/components/ui/Toast'

export default function TransactionPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [modalState, setModalState] = useState<{
    isOpen: boolean; type: TransactionCategory | null 
  }>({ isOpen: false, type: null })

  const handleCloseModal = () => setModalState({ isOpen: false, type: null })

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Transactions</h1>
          <TransactionToolbar
            isDropdownOpen={isDropdownOpen}
            onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
            onSelectType={(type) => {
              setModalState({ isOpen: true, type });
              setIsDropdownOpen(false);
            }}
          />
        </div>

        <div className="content-section">
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
            Transaction list will be displayed here
          </p>
        </div>
      </div>

      {/* Gọi Modal tách biệt */}
      {modalState.isOpen && modalState.type && (
        <TransactionFormModal type={modalState.type} onClose={handleCloseModal} />
      )}
      <Toast />
    </>
  )
}