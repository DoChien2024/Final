import { useEffect } from 'react'
import SearchBar from '@/components/table/SearchBar'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'
import PDSessionFormModal from './PDSessionFormModal'
import { pdSessionService } from './pd-session.service'
import { useTableManager } from '@/hooks/useTableManager'
import { createPDSessionsColumns } from './pd-sessions.columns'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'
import { usePDSessionFormMutations } from './hooks/usePDSessionFormMutations'
import type { PDSession } from './pd-session.types'

export default function PDSessions() {
  const { isOpen: isModalOpen, selectedData: selectedPDSession, mode: modalMode, open: openModal, close: closeModal } = useModalStore()
  const { confirmDelete } = useConfirmStore()
  const { setDeleteHandler } = useTableActionStore()
  const { deleteMutation } = usePDSessionFormMutations()

  const {
    page,
    limit,
    sorting,
    data,
    isLoading,
    error,
    updateParams,
    handleSortChange,
  } = useTableManager<PDSession>({
    queryKey: 'pd-sessions',
    fetchFn: (params) => pdSessionService.getPDSessions({ 
      ...params,
      f_type: 'pd',
      embed: 'author,category'
    }),
    defaultSortField: 'createdAt',
    defaultSortOrder: 'desc',
    defaultLimit: 10,
  })

  // Setup delete handler for table actions
  useEffect(() => {
    setDeleteHandler((id) => {
      confirmDelete(() => deleteMutation.mutate(id), 'this PD session')
    })
  }, [setDeleteHandler, confirmDelete, deleteMutation])

  // Table columns
  const columns = createPDSessionsColumns()

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">PD Session</h1>
          <div className="page-actions">
            <SearchBar
              placeholder="Search..."
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
          emptyMessage="No PD sessions found"
        />
      </div>

      <PDSessionFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pdSession={selectedPDSession}
        mode={modalMode}
      />

      <Toast />
    </>
  )
}




