import { useMutation, useQueryClient } from '@tanstack/react-query'
import SearchBar from '@/components/table/SearchBar'
import DataTable from '@/components/table/DataTable'
import Toast from '@/components/ui/Toast'
import ClientFormModal from './ClientFormModal'
import { clientService } from './client.service'
import { useTableManager } from '@/hooks/useTableManager'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useToastStore } from '@/store/toastStore'
import { useModalStore } from '@/store'
import { useTableActionStore } from '@/store/tableActionStore'
import { createClientsColumns } from './clients.columns'
import type { Client } from './client.types'

export default function ClientManagement() {
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
  } = useTableManager<Client>({
    queryKey: 'admin-clients',
    fetchFn: (params) => clientService.getClients({ ...params, embed: 'address.fullAddress' }),
    defaultSortField: 'createdAt',
    defaultSortOrder: 'desc',
    defaultLimit: 10,
  })

  const selectedClient = data?.items?.find((c) => c.id === selectedId) || null

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string } }) =>
      clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] })
      showToast('Client updated successfully', 'success')
      close()
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update client', 'error')
      hideConfirm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] })
      showToast('Client deleted successfully', 'success')
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to delete client', 'error')
      hideConfirm()
    },
  })

  // Setup delete handler for table actions
  setDeleteHandler((id) => {
    confirmDelete(() => deleteMutation.mutate(id), 'this client')
  })

  const handleSubmit = (data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string }) => {
    if (!selectedClient) return
    confirmUpdate(() => updateMutation.mutate({ id: selectedClient.id, data }), 'this client')
  }

  const columns = createClientsColumns()

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Account / Client Management</h1>
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
          emptyMessage="No clients found"
        />
      </div>

      <ClientFormModal
        isOpen={isOpen}
        onClose={close}
        onSubmit={handleSubmit}
        client={selectedClient}
        isLoading={updateMutation.isPending}
        showPhoneNumber={true}
      />

      <Toast />
    </>
  )
}




