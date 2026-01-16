import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { PAGINATION_OPTIONS } from '../../config/constants';

interface PaginationProps {
  currentPage: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  // ...existing code...
  return (
    <div className="table-footer">
      <div className="footer-info">
        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} entries.
      </div>
      <div className="pagination">
        <select
          value={limit}
          onChange={(e) => onLimitChange(parseInt(e.target.value))}
          className="limit-select"
        >
          {PAGINATION_OPTIONS.map(option => (
            <option key={option} value={option}>{option} per page</option>
          ))}
        </select>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          <FiChevronLeft />
        </button>
        <span className="page-number">{currentPage}</span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="pagination-btn"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  )
}
