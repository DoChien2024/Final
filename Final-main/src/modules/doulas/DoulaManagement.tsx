import { useMutation, useQueryClient } from '@tanstack/react-query'
import SearchBar from '@/components/table/SearchBar'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'
import DoulaFormModal from './DoulaFormModal'
import { doulaService } from './doula.service'
import { useTableManager } from '@/hooks/useTableManager'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useToastStore } from '@/store/toastStore'
import { useModalStore } from '@/store'
import { useTableActionStore } from '@/store/tableActionStore'
import { createDoulasColumns } from './doulas.columns'
import { removeEmptyFields } from '@/utils'
import type { Doula } from './doula.types'

export default function DoulaManagement() {
  const queryClient = useQueryClient()
  const { isOpen, selectedId, close } = useModalStore()
  const { confirmUpdate, confirmDelete, hideConfirm } = useConfirmStore()
  const { showToast } = useToastStore()
  const { setDeleteHandler } = useTableActionStore()

  const {
    page,
    limit,
    sorting,
    data,
    isLoading,
    error,
    updateParams,
    handleSortChange,
  } = useTableManager<Doula>({
    queryKey: 'admin-doulas',
    fetchFn: doulaService.getDoulas,
    defaultSortField: 'createdAt',
    defaultSortOrder: 'desc',
    defaultLimit: 10,
  })

  // Get selected doula from data
  const selectedDoula = data?.items?.find((d) => d.id === selectedId) || null

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string } }) =>
      doulaService.updateDoula(id, removeEmptyFields(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-doulas'] })
      showToast('Doula updated successfully', 'success')
      close()
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update doula', 'error')
      hideConfirm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => doulaService.deleteDoula(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-doulas'] })
      showToast('Doula deleted successfully', 'success')
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to delete doula', 'error')
      hideConfirm()
    },
  })

  // Setup delete handler for table actions
  setDeleteHandler((id) => {
    confirmDelete(() => deleteMutation.mutate(id.toString()), 'this doula')
  })

  const handleSubmit = (data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string }) => {
    if (!selectedDoula) return
    confirmUpdate(() => updateMutation.mutate({ id: selectedDoula.id, data }), 'this doula')
  }

  const columns = createDoulasColumns()

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Account / Doula Management</h1>
        <div className="page-actions">
          <SearchBar />
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
        emptyMessage="No doulas found"
      />

      <DoulaFormModal
        isOpen={isOpen}
        onClose={close}
        onSubmit={handleSubmit}
        doula={selectedDoula}
        isLoading={updateMutation.isPending}
        showPhoneNumber={true}
      />

      <Toast />
    </div>
  )
}




