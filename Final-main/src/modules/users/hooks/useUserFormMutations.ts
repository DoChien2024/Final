import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/store/toastStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { adminUserService } from '../user.service'
import { removeEmptyFields, type AdminUserFormData } from '@/utils'

export const useUserFormMutations = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { hideConfirm } = useConfirmStore()
  const { close: closeModal } = useModalStore()

  const createMutation = useMutation({
    mutationFn: (data: AdminUserFormData) => 
      adminUserService.createAdmin(removeEmptyFields(data) as AdminUserFormData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-admins'] })
      showToast('Admin added successfully', 'success')
      closeModal()
      hideConfirm()
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create admin user'
      showToast(errorMessage, 'error')
      console.error('Create error:', error)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdminUserFormData> }) => 
      adminUserService.updateAdmin(id, removeEmptyFields(data) as AdminUserFormData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-admins'] })
      showToast('Admin edited successfully', 'success')
      closeModal()
      hideConfirm()
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update admin user'
      showToast(errorMessage, 'error')
      console.error('Update error:', error)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminUserService.deleteAdmin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-admins'] })
      showToast('Admin deleted successfully', 'success')
      hideConfirm()
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete admin user'
      showToast(errorMessage, 'error')
      hideConfirm()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
