import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTransactionConfirm } from '../../hooks/useTransactionConfirm'
import { TransactionConfirmView } from './TransactionConfirmView'
import type { TransactionFormValues } from '../../types'
import type { TransactionCategory } from '../../constants'

interface LocationState {
  formData: TransactionFormValues
  mode: 'draft' | 'submit'
  category: TransactionCategory
}

export function TransactionConfirmPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LocationState | null

  // Guard: Redirect if no data
  useEffect(() => {
    if (!state?.formData) {
      navigate('/transactions', { replace: true })
    }
  }, [state, navigate])

  const { formData, mode, category } = state || {}

  // Use shared hook for all logic
  const { form, contextValue, handleCreate, isLoading } = useTransactionConfirm({
    formData: formData || null,
    mode: mode || null,
    category: category!,
  })

  const handleBack = () => {
    navigate(-1) // Go back to form with data preserved
  }

  if (!formData || !category || !mode) return null

  return (
    <TransactionConfirmView
      mode={mode}
      contextValue={contextValue}
      form={form}
      isLoading={isLoading}
      onBack={handleBack}
      onCreate={handleCreate}
      variant="page"
    />
  )
}
