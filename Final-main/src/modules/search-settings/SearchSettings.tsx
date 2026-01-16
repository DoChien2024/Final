import { useEffect } from 'react'
import SearchBar from '@/components/table/SearchBar'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'
import { searchSettings } from './settings.service'
import { useTableManager } from '@/hooks/useTableManager'
import { createSearchSettingsColumns } from './search-settings.columns'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'
import SearchSettingFormModal from './SearchSettingFormModal'
import { useSearchSettingFormMutations } from './hooks/useSearchSettingFormMutations'
import type { TrendingKeyword } from './settings.types'

export default function SearchSettings() {
  const { confirmDelete } = useConfirmStore()
  const { isOpen: isModalOpen, selectedData: selectedKeyword, open: openModal, close: closeModal } = useModalStore()
  const { setDeleteHandler } = useTableActionStore()
  const { deleteMutation } = useSearchSettingFormMutations()

  const {
    page,
    limit,
    sorting,
    data,
    isLoading,
    error,
    updateParams,
    handleSortChange,
  } = useTableManager<TrendingKeyword>({
    queryKey: 'search-settings',
    fetchFn: searchSettings.getSearchSettings,
    defaultSortField: 'createdAt',
    defaultSortOrder: 'desc',
    defaultLimit: 10,
  })

  // Setup delete handler for table actions
  useEffect(() => {
    setDeleteHandler((id) => {
      confirmDelete(() => deleteMutation.mutate(id), 'this keyword')
    })
  }, [setDeleteHandler, confirmDelete, deleteMutation])

  const columns = createSearchSettingsColumns()

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Search Settings</h1>
          <div className="page-actions">
            <SearchBar
              placeholder="Search keywords..."
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
          emptyMessage="No search settings found"
        />
      </div>

      <Toast />

      <SearchSettingFormModal
        isOpen={isModalOpen}
        mode={selectedKeyword ? 'edit' : 'create'}
        onClose={closeModal}
        initialData={selectedKeyword}
      />
    </>
  )
}




