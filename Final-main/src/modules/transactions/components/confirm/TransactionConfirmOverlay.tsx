import { useTransactionConfirm } from '../../hooks/useTransactionConfirm'
import { useTransactionModalStore } from '../../store/useTransactionModalStore'
import { TransactionConfirmView } from './TransactionConfirmView'

export function TransactionConfirmOverlay() {
  const { confirmData, confirmMode, closeConfirm } = useTransactionModalStore()

  const formData = confirmData
  const mode = confirmMode

  // Use shared hook for all logic
  const { form, contextValue, handleCreate, isLoading } = useTransactionConfirm({
    formData: formData || null,
    mode: mode || null,
  })

  const handleBack = () => {
    closeConfirm() // Just close confirm overlay, back to form
  }

  if (!formData || !mode) return null

  return (
    <TransactionConfirmView
      mode={mode}
      contextValue={contextValue}
      form={form}
      isLoading={isLoading}
      onBack={handleBack}
      onCreate={handleCreate}
      variant="overlay"
    />
  )
}
