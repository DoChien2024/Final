import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/store/toastStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { searchSettings } from '../settings.service'
import { removeEmptyFields } from '@/utils'

export const useSearchSettingFormMutations = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { hideConfirm } = useConfirmStore()
  const { close: closeModal } = useModalStore()

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: any) => 
      searchSettings.createSearchSetting(removeEmptyFields(data) as any),
    onSuccess: () => {
      showToast('Search setting created successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['search-settings'] })
      closeModal()
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to create search setting', 'error')
      hideConfirm()
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      searchSettings.updateSearchSetting(id, removeEmptyFields(data) as any),
    onSuccess: () => {
      showToast('Search setting updated successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['search-settings'] })
      closeModal()
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update search setting', 'error')
      hideConfirm()
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => searchSettings.deleteSearchSetting(id),
    onSuccess: () => {
      showToast('Search setting deleted successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['search-settings'] })
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to delete search setting', 'error')
      hideConfirm()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
