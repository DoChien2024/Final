import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/store/toastStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { pdSessionService } from '../pd-session.service'
import { createTransform } from '@/utils'
import type { PDSessionFormData } from '@/utils/validationSchemas'

export const usePDSessionFormMutations = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { hideConfirm } = useConfirmStore()
  const { close: closeModal } = useModalStore()

  // Transform form data sang API format using helper
  const transformFormData = createTransform<PDSessionFormData, any>({
    defaults: { status: 'unpublished', type: 'pd' },
    rename: { featuredImageId: 'picture' },
    clean: true,
    custom: (data: any) => ({
      ...data,
      title: data.title,
      author: data.author,
      content: data.content,
      timeToRead: data.timeToRead,
      status: data.status || 'unpublished',
      type: 'pd',
      ...(data.categoryId && { categoryId: data.categoryId }),
    }),
  })

  // Helper để reset modal và refresh data
  const closeModalAndRefresh = () => {
    closeModal()
    queryClient.invalidateQueries({ queryKey: ['pd-sessions'], refetchType: 'active' })
    hideConfirm()
  }

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: PDSessionFormData) => 
      pdSessionService.createPDSession(transformFormData(data)),
    onSuccess: () => {
      showToast('PD Session created successfully', 'success')
      closeModalAndRefresh()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to create PD session', 'error')
      hideConfirm()
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PDSessionFormData }) => 
      pdSessionService.updatePDSession(id, transformFormData(data)),
    onSuccess: async () => {
      showToast('PD Session updated successfully', 'success')
      closeModal()
      // Wait a bit for backend to process, then refetch
      await new Promise(resolve => setTimeout(resolve, 500))
      queryClient.invalidateQueries({ queryKey: ['pd-sessions'] })
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update PD session', 'error')
      hideConfirm()
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => pdSessionService.deletePDSession(id),
    onSuccess: () => {
      showToast('PD Session deleted successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['pd-sessions'] })
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to delete PD session', 'error')
      hideConfirm()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
