import { createColumnHelper } from '@tanstack/react-table'
import type { AdminUser } from './user.types'
import DataTableActions from '@/components/table/DataTableActions'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'

const columnHelper = createColumnHelper<AdminUser>()

export const createUsersColumns = () => [
  columnHelper.accessor('username', {
    header: 'Username',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '120px' }}>{info.getValue()}</div>
    ),
    size: 150,
  }),
  columnHelper.accessor('firstName', {
    header: 'First Name',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '100px' }}>{info.getValue() || '-'}</div>
    ),
    size: 130,
  }),
  columnHelper.accessor('lastName', {
    header: 'Last Name',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '100px' }}>{info.getValue() || '-'}</div>
    ),
    size: 130,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '180px' }}>{info.getValue()}</div>
    ),
    size: 200,
  }),
  columnHelper.accessor('role', {
    header: 'Role',
    enableSorting: false,
    cell: info => {
      const role = info.getValue()
      return (
        <div style={{ minWidth: '100px' }}>
          <span className={`role-badge role-${role}`}>{role}</span>
        </div>
      )
    },
    size: 120,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: info => {
      const status = info.getValue()
      const displayStatus = status === 'active' ? 'Active' : 'Inactive'
      const dotColor = status === 'active' ? '#28a745' : '#6c757d'
      
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '100px' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: dotColor,
            display: 'inline-block'
          }} />
          <span>{displayStatus}</span>
        </div>
      )
    },
    size: 120,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const { open } = useModalStore()
      const { triggerDelete } = useTableActionStore()
      return (
        <DataTableActions
          id={row.original.id}
          onEdit={() => open('edit', row.original.id, row.original)}
          onDelete={() => triggerDelete(row.original.id)}
        />
      )
    },
  }),
]
