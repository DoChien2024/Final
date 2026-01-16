import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'

interface DataTableActionsProps {
  id: number | string
  editPath?: string
  viewPath?: string
  onEdit?: () => void
  onDelete?: (id: number | string) => void
  showView?: boolean
  showEdit?: boolean
  showDelete?: boolean
}

export default function DataTableActions({
  id,
  editPath,
  viewPath,
  onEdit,
  onDelete,
  showView = false,
  showEdit = true,
  showDelete = true,
}: DataTableActionsProps) {
  const navigate = useNavigate()

  const handleEdit = () => {
    if (onEdit) {
      onEdit()
    } else if (editPath) {
      navigate(editPath)
    }
  }

  return (
    <div className="action-buttons">
      {showView && viewPath && (
        <button
          onClick={() => navigate(viewPath)}
          className="btn-icon btn-view"
          title="View"
        >
          <FiEye />
        </button>
      )}
      {showEdit && (onEdit || editPath) && (
        <button
          onClick={handleEdit}
          className="btn-icon btn-edit"
          title="Edit"
        >
          <FiEdit2 />
        </button>
      )}
      {showDelete && onDelete && (
        <button
          onClick={() => onDelete(id)}
          className="btn-icon btn-delete"
          title="Delete"
        >
          <FiTrash2 />
        </button>
      )}
    </div>
  )
}
