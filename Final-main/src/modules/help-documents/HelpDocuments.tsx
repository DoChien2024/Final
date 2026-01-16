import { useEffect } from 'react'
import SearchBar from '@/components/table/SearchBar'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'
import HelpDocumentFormModal from './HelpDocumentFormModal'
import { helpDocumentService } from './help-document.service'
import { useTableManager } from '@/hooks/useTableManager'
import { createHelpDocumentsColumns } from './help-documents.columns'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'
import { useHelpDocumentFormMutations } from './hooks/useHelpDocumentFormMutations'
import type { HelpDocument } from './help-document.types'

export default function HelpDocuments() {
  const { confirmDelete } = useConfirmStore()
  const { setDeleteHandler } = useTableActionStore()
  const { deleteMutation } = useHelpDocumentFormMutations()

  const { isOpen: isModalOpen, selectedData: selectedDocument, mode: modalMode, open: openModal, close: closeModal } = useModalStore()

  const {
    page,
    limit,
    sorting,
    data,
    isLoading,
    error,
    updateParams,
    handleSortChange,
  } = useTableManager<HelpDocument>({
    queryKey: 'help-documents',
    fetchFn: helpDocumentService.getHelpDocuments,
    defaultSortField: 'createdAt',
    defaultSortOrder: 'desc',
    defaultLimit: 10,
  })

  // Setup delete handler for table actions
  useEffect(() => {
    setDeleteHandler((id) => {
      confirmDelete(() => deleteMutation.mutate(id), 'this document')
    })
  }, [setDeleteHandler, confirmDelete, deleteMutation])

  const columns = createHelpDocumentsColumns()

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Help Documents</h1>
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
          emptyMessage="No help documents found"
        />
      </div>

      <HelpDocumentFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        helpDocument={selectedDocument}
        mode={modalMode}
      />

      <Toast />
    </>
  )
}




