import { createColumnHelper } from '@tanstack/react-table'
import type { Voucher } from './voucher.types'
import DataTableActions from '@/components/table/DataTableActions'
import { formatDateTime, getStatusColor } from '@/utils'
import { useTableActionStore } from '@/store/tableActionStore'

const columnHelper = createColumnHelper<Voucher>()

export const createVouchersColumns = () => [
  columnHelper.accessor('id', {
    header: 'ID',
    enableSorting: false,
    cell: info => {
      const id = String(info.getValue())
      return (
        <div 
          style={{ 
            maxWidth: '150px',
            wordBreak: 'break-all',
            whiteSpace: 'normal',
            lineHeight: '1.3'
          }} 
          title={id}
        >
          {id}
        </div>
      )
    },
    size: 150,
  }),
  columnHelper.accessor('code', {
    header: 'Code',
    enableSorting: false,
    cell: info => (
      <div 
        style={{ 
          maxWidth: '150px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        title={info.getValue()}
      >
        {info.getValue()}
      </div>
    ),
    size: 130,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: info => {
      const status = info.getValue()
      const displayStatus = status === 'active' ? 'Active' : status === 'expired' ? 'Expired' : 'Inactive'
      
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '85px' }}>
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
    size: 100,
  }),
  columnHelper.accessor('startDate', {
    header: 'Start Date',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '125px' }}>{formatDateTime(info.getValue())}</div>
    ),
    size: 140,
  }),
  columnHelper.accessor('endDate', {
    header: 'End Date',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '125px' }}>{formatDateTime(info.getValue())}</div>
    ),
    size: 140,
  }),
  columnHelper.display({
    id: 'usage',
    header: 'Number Of Uses',
    enableSorting: false,
    cell: ({ row }) => {
      const used = Number(row.original.numOfUsed) || 0
      const max = row.original.quantityUse || 0
      const display = `${used}/${max}`
      return <div style={{ minWidth: '80px', textAlign: 'center' }}>{display}</div>
    },
    size: 100,
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const { triggerDelete } = useTableActionStore()
      return (
        <DataTableActions
          id={row.original.id}
          viewPath={`/vouchers/${row.original.id}/view`}
          showView={true}
          showEdit={false}
          onDelete={() => triggerDelete(row.original.id)}
        />
      )
    },
    size: 90,
  }),
]

