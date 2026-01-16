import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/store/toastStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { helpDocumentService } from '../help-document.service'
import { removeEmptyFields } from '@/utils'
import type { HelpDocumentFormData } from '../help-document.types'

export const useHelpDocumentFormMutations = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { hideConfirm } = useConfirmStore()
  const { close: closeModal } = useModalStore()

  const createMutation = useMutation({
    mutationFn: (data: HelpDocumentFormData) => 
      helpDocumentService.createHelpDocument(removeEmptyFields(data) as HelpDocumentFormData),
    onSuccess: () => {
      showToast('Help document created successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['help-documents'] })
      closeModal()
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to create help document', 'error')
      hideConfirm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: HelpDocumentFormData }) =>
      helpDocumentService.updateHelpDocument(id, removeEmptyFields(data) as HelpDocumentFormData),
    onSuccess: () => {
      showToast('Help document updated successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['help-documents'] })
      closeModal()
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update help document', 'error')
      hideConfirm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: helpDocumentService.deleteHelpDocument,
    onSuccess: () => {
      showToast('Help document deleted successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['help-documents'] })
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to delete help document', 'error')
      hideConfirm()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
