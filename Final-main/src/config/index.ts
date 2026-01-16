import { 
  FiUsers, FiFileText, FiGrid, 
  FiBox, FiGift, FiBook, FiSearch 
} from 'react-icons/fi'

export const MENU_ITEMS = [
  { 
    path: '#accounts', 
    icon: FiUsers, 
    label: 'Accounts',
    submenu: [
      { path: '/admin-management', label: 'Admin Management' },
      { path: '/doula-management', label: 'Doula Management' },
      { path: '/client-management', label: 'Client Management' },
    ]
  },
  { path: '/articles', icon: FiFileText, label: 'Article' },
  { path: '/pd-session', icon: FiBox, label: 'PD Session' },
  { path: '/categories', icon: FiGrid, label: 'Category' },
  { path: '/vouchers', icon: FiGift, label: 'Voucher' },
  { path: '/help-documents', icon: FiBook, label: 'Help Documents' },
  { path: '/search-settings', icon: FiSearch, label: 'Search Settings' },
]

export const PAGINATION_OPTIONS = [10, 25, 50, 100]

export const STATUS_LABELS: Record<string, string> = {
  published: 'Show',
  draft: 'Hide',
  active: 'Show',
  inactive: 'Hide',
}
