import { FiChevronDown } from 'react-icons/fi'
import type { TransactionCategory } from '../../../constants'

interface TransactionToolbarProps {
  isDropdownOpen: boolean
  onToggleDropdown: () => void
  onSelectType: (type: TransactionCategory) => void
}

export function TransactionToolbar({ isDropdownOpen, onToggleDropdown, onSelectType }: TransactionToolbarProps) {
  return (
    <div className="page-actions">
      <div className="dropdown-container" style={{ position: 'relative' }}>
        <button
          onClick={onToggleDropdown}
          className="btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Create Transaction
          <FiChevronDown style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>
        {isDropdownOpen && (
          <div className="user-menu-dropdown" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 1000 }}>
            {(['debit', 'credit'] as TransactionCategory[]).map((type) => (
              <button
                key={type}
                onClick={() => onSelectType(type)}
                className="user-menu-item"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
