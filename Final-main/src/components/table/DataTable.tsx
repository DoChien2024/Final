import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { FiChevronDown } from 'react-icons/fi'
import PageLoader from '../ui/PageLoader'
import Pagination from './Pagination'

interface DataTableProps<T> {
  data: T[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[]
  sorting: SortingState
  onSortChange: (columnId: string) => void
  isLoading?: boolean
  error?: Error | null
  pagination?: {
    currentPage: number
    totalPages: number
    total: number
    limit: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
  }
  emptyMessage?: string
}

export default function DataTable<T>({
  data,
  columns,
  sorting,
  onSortChange,
  isLoading = false,
  error = null,
  pagination,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
    // setup table instance
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      // Handle sorting change
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      if (newSorting.length > 0) {
        onSortChange(newSorting[0].id)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    manualPagination: true,
    columnResizeMode: 'onChange',
  })

  return (
    <div className="table-wrapper">
      <div className="table-container">
        <PageLoader isLoading={isLoading}>
          {error ? (
            <div className="error">
              <p>Error loading data</p>
              <p style={{ fontSize: '12px', color: '#666' }}>{error.message}</p>
            </div>
          ) : data.length === 0 ? (
            <div className="loading" style={{ padding: '48px', textAlign: 'center' }}>
              {emptyMessage}
            </div>
          ) : (
            <table className="data-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={() =>
                          header.column.getCanSort() && onSortChange(header.id)
                        }
                        className={header.column.getCanSort() ? 'sortable' : ''}
                        style={{ width: header.getSize() }}
                      >
                        <div className="th-content">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <FiChevronDown className="sort-icon" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </PageLoader>
      </div>
      
      {pagination && !error && data.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={pagination.onPageChange}
          onLimitChange={pagination.onLimitChange}
        />
      )}
    </div>
  )
}
