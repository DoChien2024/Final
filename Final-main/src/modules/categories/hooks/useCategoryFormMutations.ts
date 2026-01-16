import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/store/toastStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { categoryService } from '../category.service'
import { createTransform } from '@/utils'
import type { CategoryFormData } from '@/utils/validationSchemas'

export const useCategoryFormMutations = (selectedCategory?: any) => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { hideConfirm } = useConfirmStore()
  const { close: closeModal } = useModalStore()

  // Transform helper - centralized payload transformation
  const transformCategory = createTransform<CategoryFormData, any>({
    pick: ['name', 'title', 'status', 'image'],
    defaults: { status: 'active', image: '' },
    clean: true,
  })

  // Helper để reset modal và refresh data
  const closeModalAndRefresh = () => {
    closeModal()
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    hideConfirm()
  }

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CategoryFormData) => 
      categoryService.createCategory(transformCategory(data)),
    onSuccess: () => {
      showToast('Category created successfully', 'success')
      closeModalAndRefresh()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to create category', 'error')
      hideConfirm()
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => {
      const payload = transformCategory({
        ...data,
        image: data.image || selectedCategory?.picture?.uri || '',
      })
      return categoryService.updateCategory(id, payload)
    },
    onSuccess: () => {
      showToast('Category updated successfully', 'success')
      closeModalAndRefresh()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update category', 'error')
      hideConfirm()
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      showToast('Category deleted successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to delete category', 'error')
      hideConfirm()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
