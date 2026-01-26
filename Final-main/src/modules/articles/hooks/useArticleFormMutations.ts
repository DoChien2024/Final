import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToastStore } from '@/store/toastStore'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useModalStore } from '@/store/modalStore'
import { articleApi } from '../api/api'
import { createTransform } from '@/utils'
import type { ArticleFormData } from '../schema/article.schema'

export const useArticleFormMutations = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()
  const { hideConfirm } = useConfirmStore()
  const { close: closeModal } = useModalStore()

  // Transform form data sang API format using helper
  const transformFormData = createTransform<ArticleFormData, any>({
    defaults: { status: 'draft', type: 'article' },
    rename: { featuredImageId: 'picture' },
    clean: true,
    custom: (data: any) => ({
      ...data,
      title: data.title,
      author: data.author,
      content: data.content,
      timeToRead: Number(data.duration),
      status: data.status || 'draft',
      ...(data.categoryId && { categoryId: data.categoryId }),
    }),
  })

  // Helper để reset modal và refresh data
  const closeModalAndRefresh = () => {
    closeModal()
    queryClient.invalidateQueries({ queryKey: ['articles'], refetchType: 'active' })
    hideConfirm()
  }

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: ArticleFormData) => 
      articleApi.create(transformFormData(data)),
    onSuccess: () => {
      showToast('Article created successfully', 'success')
      closeModalAndRefresh()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to create article', 'error')
      hideConfirm()
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ArticleFormData }) => 
      articleApi.update(id, transformFormData(data)),
    onSuccess: async () => {
      showToast('Article updated successfully', 'success')
      closeModal()
      // Wait a bit for backend to process, then refetch
      await new Promise(resolve => setTimeout(resolve, 500))
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update article', 'error')
      hideConfirm()
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => articleApi.delete(id),
    onSuccess: () => {
      showToast('Article deleted successfully', 'success')
      queryClient.invalidateQueries({ queryKey: ['articles'] })
      hideConfirm()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to delete article', 'error')
      hideConfirm()
    },
  })

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  }
}
