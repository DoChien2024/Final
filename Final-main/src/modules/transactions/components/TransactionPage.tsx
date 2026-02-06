import { useState } from 'react'
import { TransactionToolbar } from './form/share/TransactionToolbar'
import { TransactionFormModal } from './index'
import { useTransactionModalStore } from '../store/useTransactionModalStore'
import { createTransactionColumns } from './TransactionColumns'
import { mockTransactionList } from '../mock-data'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'

export default function TransactionPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { isOpen, category, openModal, closeModal } = useTransactionModalStore()
  
  // Mock data - will be replaced with real API
  const [page] = useState(1)
  const [limit] = useState(10)
  
  const mockPaginationData = {
    items: mockTransactionList,
    total: mockTransactionList.length,
    totalPages: 1,
  }

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

        <DataTable
          data={mockPaginationData.items}
          columns={createTransactionColumns()}
          sorting={[]}
          onSortChange={() => {}}
          isLoading={false}
          error={null}
          pagination={{
            currentPage: page,
            totalPages: mockPaginationData.totalPages,
            total: mockPaginationData.total,
            limit,
            onPageChange: () => {},
            onLimitChange: () => {},
          }}
          emptyMessage="No transactions found"
        />
      </div>

      {/* Modal will hide itself when on confirm page */}
      {isOpen && category && (
        <TransactionFormModal onClose={closeModal} />
      )}
      <Toast />
    </>
  )
}