import { createColumnHelper } from '@tanstack/react-table'
import type { Category } from './category.types'
import DataTableActions from '@/components/table/DataTableActions'
import { formatDate, getStatusColor } from '@/utils'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'

const columnHelper = createColumnHelper<Category>()

export const createCategoriesColumns = () => [
  columnHelper.accessor('name', {
    header: 'Name',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '150px', fontWeight: 500 }}>{info.getValue()}</div>
    ),
    size: 180,
  }),
  columnHelper.accessor('picture', {
    header: 'Image',
    enableSorting: false,
    cell: info => {
      const picture = info.getValue()
      return (
        <div style={{ minWidth: '80px', display: 'flex', alignItems: 'center' }}>
          {picture?.uri ? (
            <img
              src={picture.uri}
              alt="Category"
              style={{
                width: '50px',
                height: '50px',
                objectFit: 'cover',
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}
            />
          ) : (
            <div
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                border: '1px solid #e0e0e0'
              }}
            />
          )}
        </div>
      )
    },
    size: 100,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: info => {
      const status = info.getValue()
      const displayStatus = status === 'active' ? 'Active' : 'Inactive'
      
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '100px' }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: getStatusColor(status),
            display: 'inline-block'
          }} />
          <span>{displayStatus}</span>
        </div>
      )
    },
    size: 120,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created Date',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '120px' }}>{formatDate(info.getValue(), 'dd MMM yyyy')}</div>
    ),
    size: 140,
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
    size: 100,
  }),
]