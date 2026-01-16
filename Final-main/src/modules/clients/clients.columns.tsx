import { createColumnHelper } from '@tanstack/react-table'
import type { Client } from './client.types'
import DataTableActions from '@/components/table/DataTableActions'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'

const columnHelper = createColumnHelper<Client>()

export const createClientsColumns = () => [
  columnHelper.display({
    id: 'avatar',
    header: 'Avatar',
    enableSorting: false,
    cell: ({ row }) => {
      const avatarUrl = row.original.picture?.uri || row.original.avatarUrl
      return (
        <div style={{ minWidth: '60px' }}>
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="Avatar" 
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                objectFit: 'cover' 
              }} 
            />
          ) : (
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: '#e0e0e0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <span style={{ fontSize: '14px', color: '#757575' }}>??</span>
            </div>
          )}
        </div>
      )
    },
    size: 80,
  }),
  columnHelper.display({
    id: 'fullName',
    header: 'Full name',
    enableSorting: false,
    cell: ({ row }) => {
      const firstName = row.original.firstName || ''
      const lastName = row.original.lastName || ''
      const fullName = `${firstName} ${lastName}`.trim() || '-'
      return <div style={{ minWidth: '150px' }}>{fullName}</div>
    },
    size: 180,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '180px' }}>{info.getValue()}</div>
    ),
    size: 200,
  }),
  columnHelper.accessor('phoneNumber', {
    header: 'Phone number',
    enableSorting: false,
    cell: info => {
      const phone = info.getValue()
      const countryCode = info.row.original.countryCode
      
      if (!phone) return <div style={{ minWidth: '120px' }}>-</div>
      const displayPhone = countryCode ? `${countryCode} ${phone}` : phone
      return <div style={{ minWidth: '120px' }}>{displayPhone}</div>
    },
    size: 150,
  }),
  columnHelper.display({
    id: 'dateOfBirth',
    header: 'Birthday',
    enableSorting: false,
    cell: ({ row }) => {
      const date = row.original.birthDate || row.original.dateOfBirth
      if (!date) return <div style={{ minWidth: '100px' }}>-</div>
      const formattedDate = new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
      return <div style={{ minWidth: '100px' }}>{formattedDate}</div>
    },
    size: 120,
  }),
  columnHelper.display({
    id: 'address',
    header: 'Address',
    enableSorting: false,
    cell: ({ row }) => {
      const address = row.original.address?.fullAddress || '-'
      return <div style={{ minWidth: '180px' }}>{address}</div>
    },
    size: 200,
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
          id={row.original.id as any}
          viewPath={`/account/client-management/${row.original.id}/view`}
          editPath={`/account/client-management/${row.original.id}/edit`}
          onEdit={() => open('edit', row.original.id)}
          onDelete={() => triggerDelete(row.original.id)}
          showView={true}
          showEdit={true}
          showDelete={true}
        />
      )
    },
  }),
]


