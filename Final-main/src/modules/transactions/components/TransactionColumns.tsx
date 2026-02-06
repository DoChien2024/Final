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
  effectiveDo: string
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
  columnHelper.display({
    id: 'actions',
    header: 'Action',
    cell: ({ row }) => {
      const { open } = useModalStore()
      
      return (
        <div style={{ minWidth: '80px' }}>
          <button
            onClick={() => open('edit', String(row.original.id), row.original)}
            className="btn-action-view"
            style={{ color: '#ef4444', fontSize: '14px', fontWeight: '500' }}
          >
            View
          </button>
        </div>
      )
    },
    size: 100,
  }),
]
