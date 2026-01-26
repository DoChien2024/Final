import { useModalStore } from '@/store/modalStore'
import ArticleFormModal from './ArticleFormModal.tsx'
import ArticleDelete from './ArticleDelete.tsx'

export default function ArticleModal() {
  const { isOpen, mode, close } = useModalStore()

  const renderModal = () => {
    switch (mode) {
      case 'create':
        return <ArticleFormModal isOpen={isOpen} onClose={close} mode="create" />
      case 'edit':
        return <ArticleFormModal isOpen={isOpen} onClose={close} mode="edit" />
      case 'delete':
        return <ArticleDelete />
      default:
        return null
    }
  }

  return <>{renderModal()}</>
}
