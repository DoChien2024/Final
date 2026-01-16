import { createColumnHelper } from '@tanstack/react-table'
import type { TrendingKeyword } from './settings.types'
import DataTableActions from '@/components/table/DataTableActions'
import { formatDateTime } from '@/utils'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'

const columnHelper = createColumnHelper<TrendingKeyword>()

export const createSearchSettingsColumns = () => [
  columnHelper.accessor('id', {
    header: 'ID',
    enableSorting: false,
    cell: info => {
      const id = String(info.getValue())
      return <div title={id}>{id}</div>
    },
    size: 300,
    minSize: 250,
    maxSize: 350,
  }),
  columnHelper.accessor('keyword', {
    header: 'Text',
    enableSorting: false,
    cell: info => info.getValue(),
    size: 250,
    minSize: 150,
    maxSize: 400,
  }),
  columnHelper.accessor('count', {
    id: 'times',
    header: 'Times',
    enableSorting: false,
    cell: info => info.getValue(),
    size: 100,
    minSize: 80,
    maxSize: 120,
  }),
  columnHelper.accessor('createdAt', {
    header: 'Created Date',
    enableSorting: false,
    cell: info => formatDateTime(info.getValue()),
    size: 180,
    minSize: 150,
    maxSize: 200,
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
    size: 120,
    minSize: 100,
    maxSize: 150,
  }),
]
