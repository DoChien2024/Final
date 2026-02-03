import { useState } from 'react'
import { TransactionToolbar } from './form/share/TransactionToolbar'
import { TransactionFormModal } from './index'
import { useTransactionModalStore } from '../store/useTransactionModalStore'
import Toast from '@/components/ui/Toast'

export default function TransactionPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { isOpen, category, openModal, closeModal } = useTransactionModalStore()

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Transactions</h1>
          <TransactionToolbar
            isDropdownOpen={isDropdownOpen}
            onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
            onSelectType={(type) => {
              openModal(type)
              setIsDropdownOpen(false)
            }}
          />
        </div>

        <div className="content-section">
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
            Transaction list will be displayed here
          </p>
        </div>
      </div>

      {/* Modal will hide itself when on confirm page */}
      {isOpen && category && (
        <TransactionFormModal type={category} onClose={closeModal} />
      )}
      <Toast />
    </>
  )
}