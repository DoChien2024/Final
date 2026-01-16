// Thêm các hằng số cấu hình tại đây
export const API_BASE_URL = "https://api.example.com";
export const DEFAULT_PAGE_SIZE = 10;
export const APP_NAME = "FinalPJ";

export const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  // Thêm các trạng thái khác nếu cần
};
import { FiUsers, FiFileText, FiGrid, FiBox, FiTag, FiBookOpen, FiSearch } from 'react-icons/fi';

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
];

export const PAGINATION_OPTIONS = [10, 20, 50, 100];
