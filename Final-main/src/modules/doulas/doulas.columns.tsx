import { createColumnHelper } from '@tanstack/react-table'
import type { Doula } from './doula.types'
import DataTableActions from '@/components/table/DataTableActions'
import { useModalStore } from '@/store/modalStore'
import { useTableActionStore } from '@/store/tableActionStore'

const columnHelper = createColumnHelper<Doula>()

export const createDoulasColumns = () => [
  columnHelper.display({
    id: 'avatar',
    header: 'Avatar',
    enableSorting: false,
    cell: ({ row }) => (
      <div style={{ minWidth: '60px' }}>
        {row.original.picture?.uri ? (
          <img 
            src={row.original.picture.uri} 
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
    ),
    size: 80,
  }),
  columnHelper.display({
    id: 'fullName',
    header: 'Full name',
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original.user
      if (user?.fullName) return <div style={{ minWidth: '150px' }}>{user.fullName}</div>
      const firstName = user?.firstName || ''
      const middleName = user?.middleName ? ` ${user.middleName}` : ''
      const lastName = user?.lastName || ''
      const fullName = `${firstName}${middleName} ${lastName}`.trim() || '-'
      return <div style={{ minWidth: '150px' }}>{fullName}</div>
    },
    size: 180,
  }),
  columnHelper.accessor('user.email', {
    header: 'Email',
    enableSorting: false,
    cell: info => (
      <div style={{ minWidth: '180px' }}>{info.getValue() || '-'}</div>
    ),
    size: 200,
  }),
  columnHelper.display({
    id: 'phoneNumber',
    header: 'Phone number',
    enableSorting: false,
    cell: ({ row }) => {
      const user = row.original.user
      const phone = user?.phoneNumber
      const countryCode = user?.countryCode
      
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
      const date = row.original.user?.birthDate || row.original.user?.dateOfBirth
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
          viewPath={`/account/doula-management/${row.original.id}/view`}
          editPath={`/account/doula-management/${row.original.id}/edit`}
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


