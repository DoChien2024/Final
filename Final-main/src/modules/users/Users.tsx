import { useEffect } from 'react'
import SearchBar from '@/components/table/SearchBar'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'
import UserFormModal from './UserFormModal'
import { adminUserService } from './user.service'
import { useTableManager } from '@/hooks/useTableManager'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'
import { createUsersColumns } from './users.columns'
import { useUserFormMutations } from './hooks/useUserFormMutations'
import type { AdminUser } from './user.types'

export default function Users() {
  const { isOpen: isModalOpen, selectedData: selectedUser, open: openModal, close: closeModal } = useModalStore()
  const { confirmDelete } = useConfirmStore()
  const { setDeleteHandler } = useTableActionStore()
  const { deleteMutation } = useUserFormMutations()

  const {
    page,
    limit,
    sorting,
    data,
    isLoading,
    error,
    updateParams,
    handleSortChange,
  } = useTableManager<AdminUser>({
    queryKey: 'admin-admins',
    fetchFn: adminUserService.getAdmins,
    defaultSortField: 'createdAt',
    defaultSortOrder: 'desc',
    defaultLimit: 10,
  })

  // Setup delete handler for table actions
  useEffect(() => {
    setDeleteHandler((id) => {
      confirmDelete(() => deleteMutation.mutate(id), 'this user')
    })
  }, [setDeleteHandler, confirmDelete, deleteMutation])

  const columns = createUsersColumns()

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Account / Admin Management</h1>
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
        emptyMessage="No admin users found"
      />

      <UserFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUser}
      />

      <Toast />
    </div>
  )
}


