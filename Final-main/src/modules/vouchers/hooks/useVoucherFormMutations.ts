import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/store/toastStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { voucherService } from '../voucher.service'
import { removeEmptyFields } from '@/utils'
import type { VoucherFormData } from '../voucher.types'

export const useVoucherFormMutations = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { hideConfirm } = useConfirmStore()
  const { close: closeModal } = useModalStore()

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: VoucherFormData) => 
      voucherService.createVoucher(removeEmptyFields(data) as VoucherFormData),
    onSuccess: () => {
      showToast('Voucher created successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      closeModal()
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to create voucher', 'error')
      hideConfirm()
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => voucherService.deleteVoucher(id),
    onSuccess: () => {
      showToast('Voucher deleted successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['vouchers'] })
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to delete voucher', 'error')
      hideConfirm()
    },
  })

  return {
    createMutation,
    deleteMutation,
  }
}
