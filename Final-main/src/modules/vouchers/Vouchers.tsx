import { useEffect } from 'react'
import SearchBar from '@/components/table/SearchBar'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'
import VoucherFormModal from './VoucherFormModal'
import { voucherService } from './voucher.service'
import { useTableManager } from '@/hooks/useTableManager'
import { createVouchersColumns } from './vouchers.columns'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'
import { useVoucherFormMutations } from './hooks/useVoucherFormMutations'
import type { Voucher } from './voucher.types'

export default function Vouchers() {
  const { confirmDelete } = useConfirmStore()
  const { isOpen: isModalOpen, open: openModal, close: closeModal } = useModalStore()
  const { setDeleteHandler } = useTableActionStore()
  const { deleteMutation } = useVoucherFormMutations()

  const {
    page,
    limit,
    sorting,
    data,
    isLoading,
    error,
    updateParams,
    handleSortChange,
  } = useTableManager<Voucher>({
    queryKey: 'vouchers',
    fetchFn: voucherService.getVouchers,
    defaultSortField: 'createdAt',
    defaultSortOrder: 'desc',
    defaultLimit: 10,
  })

  // Setup delete handler for table actions
  useEffect(() => {
    setDeleteHandler((id) => {
      confirmDelete(() => deleteMutation.mutate(id), 'this voucher')
    })
  }, [setDeleteHandler, confirmDelete, deleteMutation])

  const columns = createVouchersColumns()

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Voucher</h1>
          <div className="page-actions">
            <SearchBar
              placeholder="Search admin users..."
              isFetching={isLoading}
            />
            <button
              onClick={() => openModal('create')}
              className="btn-primary"
            >
              Create
            </button>
          </div>
        </div>

        <DataTable
          data={data?.items || []}
          columns={columns}
          sorting={sorting}
          onSortChange={handleSortChange}
          isLoading={isLoading}
          error={error}
          pagination={{
            currentPage: page,
            totalPages: data?.totalPages || 1,
            total: data?.total || 0,
            limit,
            onPageChange: (newPage) => updateParams({ page: newPage }),
            onLimitChange: (newLimit) => updateParams({ limit: newLimit, page: 1 }),
          }}
          emptyMessage="No vouchers found"
        />
      </div>

      <VoucherFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode="create"
      />

      <Toast />
    </>
  )
}

