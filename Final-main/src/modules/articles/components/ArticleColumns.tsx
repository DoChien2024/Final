
import { createColumnHelper } from '@tanstack/react-table'
import type { IArticleDetail } from '../article.types'
import DataTableActions from '@/components/table/DataTableActions'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'

const columnHelper = createColumnHelper<IArticleDetail>()

export const createArticlesColumns = () => [
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
      <div style={{ minWidth: '200px' }}>{info.getValue()}</div>
    ),
    size: 250,
  }),
  columnHelper.accessor('author', {
    header: 'Author',
    enableSorting: false,
    cell: info => {
      const author = info.getValue()
      if (!author) return <div style={{ minWidth: '120px' }}>-</div>
      let authorName = '-'
      if (typeof author === 'string') {
        authorName = author
      } else {
        authorName = author.fullName || `${author.firstName || ''} ${author.lastName || ''}`.trim() || '-'
      }
      return <div style={{ minWidth: '120px' }}>{authorName}</div>
    },
    size: 150,
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    enableSorting: false,
    cell: info => {
      const category = info.getValue()
      if (!category) return <div style={{ minWidth: '150px' }}>-</div>
      const categoryName = typeof category === 'string' ? category : category.name || '-'
      return <div style={{ minWidth: '150px' }}>{categoryName}</div>
    },
    size: 180,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created Date',
    enableSorting: false,
    cell: info => {
      const date = info.getValue()
      if (!date) return <div style={{ minWidth: '140px' }}>-</div>
      const formattedDate = new Date(date).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      return <div style={{ minWidth: '140px' }}>{formattedDate}</div>
    },
    size: 160,
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    enableSorting: false,
    cell: info => {
      const status = info.getValue()
      let displayStatus: string = status
      let dotColor = '#6c757d'
      
      if (status === 'published') {
        displayStatus = 'Published'
        dotColor = '#28a745'
      } else if (status === 'draft') {
        displayStatus = 'Draft'
        dotColor = '#ffc107'
      } else if (status === 'unpublished') {
        displayStatus = 'Unpublished'
        dotColor = '#6c757d'
      }
      
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: '120px' }}>
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
    size: 130,
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
