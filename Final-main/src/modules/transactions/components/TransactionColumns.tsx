import { createColumnHelper } from '@tanstack/react-table'
import { useModalStore } from '@/store/modalStore'


// Transaction list item type from mock data
interface TransactionListItem {
  id: number
  transactionId: string
  cashOrderNum: string
  orgName: string
  subOrgName: string
  bankAccountNum: string
  transactionType: string
  transactionCategory: string
  createDo: string
  effectiveDo: string | null
  isin: string | null
  currency: string
  description: string
  orderStatus: string
  orderStatusAlias: string
  netAmt: number
  feesAmt: number
  gstAmt: number
  bankChargesAmt: number
  debit: number | null
  credit: number | null
  groupId: string | null
}

const columnHelper = createColumnHelper<TransactionListItem>()

export const createTransactionColumns = () => [
  columnHelper.accessor('createDo', {
    header: 'Created Date',
    enableSorting: false,
    cell: info => {
      const date = info.getValue()
      if (!date) return <div style={{ minWidth: '100px' }}>-</div>
      const formattedDate = new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      return <div style={{ minWidth: '100px' }}>{formattedDate}</div>
    },
    size: 120,
  }),
  columnHelper.accessor('effectiveDo', {
    header: 'Effective Date',
    enableSorting: false,
    cell: info => {
      const date = info.getValue()
      if (!date) return <div style={{ minWidth: '100px' }}>-</div>
      const formattedDate = new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      return <div style={{ minWidth: '100px' }}>{formattedDate}</div>
    },
    size: 120,
  }),
  columnHelper.accessor('groupId', {
    header: 'Group ID',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '80px' }}>{info.getValue() || '-'}</div>
    ),
    size: 100,
  }),
  columnHelper.accessor('transactionId', {
    header: 'Cash Transaction ID',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '140px' }}>{info.getValue()}</div>
    ),
    size: 160,
  }),
  columnHelper.accessor('orgName', {
    header: 'Client Name',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '180px' }}>{info.getValue() || '-'}</div>
    ),
    size: 200,
  }),
  columnHelper.accessor('transactionType', {
    header: 'Transaction Type',
    enableSorting: false,
    cell: info => {
      const type = info.getValue()
      const formatted = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
      return <div style={{ minWidth: '120px' }}>{formatted}</div>
    },
    size: 140,
  }),
  columnHelper.accessor('bankAccountNum', {
    header: 'Bank Account',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '140px' }}>{info.getValue()}</div>
    ),
    size: 160,
  }),
  columnHelper.accessor('isin', {
    header: 'ISIN',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '100px' }}>{info.getValue() || '-'}</div>
    ),
    size: 120,
  }),
  columnHelper.accessor('debit', {
    header: 'Debit',
    enableSorting: false,
    cell: info => {
      const value = info.getValue()
      if (value === null || value === undefined) return <div style={{ minWidth: '100px', textAlign: 'right' }}>-</div>
      return <div style={{ minWidth: '100px', textAlign: 'right' }}>{value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    },
    size: 120,
  }),
  columnHelper.accessor('credit', {
    header: 'Credit',
    enableSorting: false,
    cell: info => {
      const value = info.getValue()
      if (value === null || value === undefined) return <div style={{ minWidth: '100px', textAlign: 'right' }}>-</div>
      return <div style={{ minWidth: '100px', textAlign: 'right' }}>{value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    },
    size: 120,
  }),
  columnHelper.accessor('bankChargesAmt', {
    header: 'Bank Charges',
    enableSorting: false,
    cell: info => {
      const value = info.getValue()
      return <div style={{ minWidth: '100px', textAlign: 'right' }}>{value.toFixed(2)}</div>
    },
    size: 120,
  }),
  columnHelper.accessor('feesAmt', {
    header: 'Fees',
    enableSorting: false,
    cell: info => {
      const value = info.getValue()
      return <div style={{ minWidth: '100px', textAlign: 'right' }}>{value.toFixed(2)}</div>
    },
    size: 120,
  }),
  columnHelper.accessor('gstAmt', {
    header: 'GST',
    enableSorting: false,
    cell: info => {
      const value = info.getValue()
      return <div style={{ minWidth: '100px', textAlign: 'right' }}>{value.toFixed(2)}</div>
    },
    size: 120,
  }),
  columnHelper.accessor('netAmt', {
    header: 'Net Amount',
    enableSorting: false,
    cell: info => {
      const value = info.getValue()
      return <div style={{ minWidth: '120px', textAlign: 'right', fontWeight: '500' }}>{value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    },
    size: 140,
  }),
  columnHelper.accessor('orderStatusAlias', {
    header: 'Status',
    enableSorting: false,
    cell: info => {
      const status = info.getValue()
      const isCompleted = status.toLowerCase() === 'completed'
      const isPending = status.toLowerCase() === 'pending'
      const isDraft = status.toLowerCase() === 'draft'
      
      return (
        <div style={{ minWidth: '100px' }}>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '500',
              textTransform: 'uppercase',
              backgroundColor: isCompleted ? '#d4edda' : isPending ? '#fff3cd' : isDraft ? '#e7f3ff' : '#f8d7da',
              color: isCompleted ? '#155724' : isPending ? '#856404' : isDraft ? '#004085' : '#721c24',
            }}
          >
            {status}
          </span>
        </div>
      )
    },
    size: 120,
  }),
  columnHelper.display({
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const { open } = useModalStore()
      
      return (
        <div style={{ minWidth: '80px' }}>
          <button
            onClick={() => open('edit', String(row.original.id), row.original)}
            className="btn-action-view"
            style={{ color: '#ef4444', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            View
          </button>
        </div>
      )
    },
    size: 100,
  }),
]
