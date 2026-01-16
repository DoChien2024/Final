import { createColumnHelper } from '@tanstack/react-table'
import type { HelpDocument } from './help-document.types'
import DataTableActions from '@/components/table/DataTableActions'
import { formatDateTime, getStatusColor } from '@/utils'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'

const columnHelper = createColumnHelper<HelpDocument>()

export const createHelpDocumentsColumns = () => [
  columnHelper.accessor('id', {
    header: 'ID',
    enableSorting: false,
    cell: info => {
      const id = String(info.getValue())
      return (
        <div 
          style={{ 
            maxWidth: '180px',
            wordBreak: 'break-all',
            whiteSpace: 'normal',
            lineHeight: '1.4'
          }} 
          title={id}
        >
          {id}
        </div>
      )
    },
    size: 180,
  }),
  columnHelper.accessor('title', {
    header: 'Title',
    enableSorting: false,
    cell: info => (
      <div style={{ 
        maxWidth: '180px',
        wordBreak: 'break-all',
        whiteSpace: 'normal',
        lineHeight: '1.4'
      }}>{info.getValue()}</div>
    ),
    size: 180,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: info => {
      const status = info.getValue()
      const displayStatus = status === 'active' ? 'Active' : 'Inactive'
      
      return (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          minWidth: '100px',
          padding: '4px 0'
        }}>
          <span style={{ 
            width: '8px', 
            height: '8px', 
            borderRadius: '50%', 
            backgroundColor: getStatusColor(status),
            display: 'inline-block',
            flexShrink: 0
          }} />
          <span style={{ fontSize: '14px' }}>{displayStatus}</span>
        </div>
      )
    },
    size: 120,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created Date',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '140px' }}>{formatDateTime(info.getValue())}</div>
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
        <div style={{ minWidth: '80px' }}>
          <DataTableActions
            id={row.original.id}
            onEdit={() => open('edit', row.original.id, row.original)}
            onDelete={() => triggerDelete(row.original.id)}
          />
        </div>
      )
    },
    size: 100,
  }),
]

