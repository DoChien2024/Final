import { FiUsers, FiFileText, FiGrid, FiBox, FiTag, FiBookOpen, FiSearch, FiDollarSign } from 'react-icons/fi'

export const MENU_ITEMS = [
  {
    path: '#accounts',
    label: 'Accounts',
    icon: FiUsers,
    submenu: [
      {
        path: '/account/admin-management',
        label: 'Admin Management',
      },
      {
        path: '/account/doula-management',
        label: 'Doula Management',
      },
      {
        path: '/account/client-management',
        label: 'Client Management',
      },
    ],
  },
  {
    path: '/articles',
    label: 'Article',
    icon: FiFileText,
  },
  {
    path: '/transactions',
    label: 'Transactions',
    icon: FiDollarSign,
  },
  {
    path: '/pd-session',
    label: 'PD Session',
    icon: FiGrid,
  },
  {
    path: '/categories',
    label: 'Category',
    icon: FiBox,
  },
  {
    path: '/vouchers',
    label: 'Voucher',
    icon: FiTag,
  },
  {
    path: '/help-documents',
    label: 'Help Documents',
    icon: FiBookOpen,
  },
  {
    path: '/search-settings',
    label: 'Search Settings',
    icon: FiSearch,
  },
]
