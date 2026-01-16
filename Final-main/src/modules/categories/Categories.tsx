import { useEffect } from 'react'
import SearchBar from '@/components/table/SearchBar'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'
import CategoryFormModal from './CategoryFormModal'
import { categoryService } from './category.service'
import { useTableManager } from '@/hooks/useTableManager'
import { createCategoriesColumns } from './categories.columns'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'
import { useCategoryFormMutations } from './hooks/useCategoryFormMutations'
import type { Category } from './category.types'

export default function Categories() {
  const { isOpen: isModalOpen, selectedData: selectedCategory, mode: modalMode, open: openModal, close: closeModal } = useModalStore()
  const { confirmDelete } = useConfirmStore()
  const { setDeleteHandler } = useTableActionStore()
  const { deleteMutation } = useCategoryFormMutations(selectedCategory)

  const {
    page,
    limit,
    sorting,
    data,
    isLoading,
    error,
    updateParams,
    handleSortChange,
  } = useTableManager<Category>({
    queryKey: 'categories',
    fetchFn: categoryService.getCategories,
    defaultSortField: 'index',
    defaultSortOrder: 'asc',
    defaultLimit: 10,
  })

  // Setup delete handler for table actions
  useEffect(() => {
    setDeleteHandler((id) => {
      confirmDelete(() => deleteMutation.mutate(id), 'this category')
    })
  }, [setDeleteHandler, confirmDelete, deleteMutation])

  // Table columns
  const columns = createCategoriesColumns()

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Category</h1>
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
          emptyMessage="No categories found"
        />
      </div>

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        category={selectedCategory}
        mode={modalMode}
      />

      <Toast />
    </>
  )
}



