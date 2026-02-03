import { useCallback } from 'react'
import { useToastStore } from '@/store'

interface UseApiMutationOptions {
  onSuccess?: () => void
  successMessage?: string
  errorMessage?: string
}

export const useApiMutation = <T extends any[]>(
  mutationFn: (...args: T) => Promise<any>,
  { onSuccess, successMessage, errorMessage }: UseApiMutationOptions = {}
) => {
  const showToast = useToastStore(state => state.showToast)

  return useCallback(
    async (...args: T) => {
      try {
        const result = await mutationFn(...args)
        
        if (successMessage) {
          showToast(successMessage, 'success')
        }
        
        onSuccess?.()
        
        return result
      } catch (error: any) {
        showToast(
          error.message || errorMessage || 'An error occurred',
          'error'
        )
        throw error
      }
    },
    [mutationFn, onSuccess, successMessage, errorMessage, showToast]
  )
}
