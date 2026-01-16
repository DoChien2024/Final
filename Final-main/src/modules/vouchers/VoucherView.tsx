import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiArrowLeft } from 'react-icons/fi'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { voucherService } from './voucher.service'
import { formatDate, formatAmount, getFullName } from '@/utils'
import type { VoucherHistoryItem } from './voucher.types'

// Field component
const InfoField = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <label style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px', fontWeight: 500 }}>
      {label}
    </label>
    <div style={{ fontSize: '15px', color: '#333' }}>{value}</div>
  </div>
)

export default function VoucherView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: voucher, isLoading, error } = useQuery({
    queryKey: ['voucher', id],
    queryFn: async () => {
      const response = await voucherService.getVoucherById(id!)
      return response?.data
    },
    enabled: !!id,
  })

  const { data: history = [], isLoading: isLoadingHistory } = useQuery({
    queryKey: ['voucher-history', id],
    queryFn: async () => {
      const response = await voucherService.getVoucherHistory(id!)
      const data = response?.data || []
      return Array.isArray(data) ? data as VoucherHistoryItem[] : []
    },
    enabled: !!id,
  })

  if (isLoading) return <LoadingSpinner />
  if (error || !voucher) return <div className="error-message">Failed to load voucher information</div>

  return (
    <div className="page-container">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <h1 className="page-title">Voucher / {voucher.code}</h1>
        </div>

        {/* Back Button */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/vouchers')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 500,
            }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
        </div>

        {/* Voucher Information Card */}
        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            padding: '32px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              fontSize: '18px',
              fontWeight: 600,
              marginBottom: '24px',
              color: '#333',
            }}
          >
            Voucher Information
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
            <InfoField label="Code" value={voucher.code || '-'} />
            <InfoField label="Start Date" value={formatDate(voucher.startDate)} />
            <InfoField label="End Date" value={formatDate(voucher.endDate)} />
            <InfoField label="Number Of Use" value={`${voucher.numOfUsed}/${voucher.quantityUse}`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
            <InfoField label="Type of coupon" value={voucher.type} />
            <InfoField label="Amount" value={formatAmount(voucher.amount, voucher.type)} />
            <InfoField label="Condition" value={voucher.minPayAmount ? `$${voucher.minPayAmount}` : '-'} />
            <InfoField label="Max Discount Amount" value={voucher.maxDiscountAmount ? `$${voucher.maxDiscountAmount}` : '-'} />
          </div>

          <InfoField label="Description" value={voucher.description || '-'} />
        </div>

        {/* Usage History Table */}
        <div
          style={{
            background: 'white',
            borderRadius: '8px',
            padding: '32px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          {isLoadingHistory ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <LoadingSpinner />
            </div>
          ) : (
            <>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'separate',
                  borderSpacing: 0,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#666',
                        background: '#f8f9fa',
                      }}
                    >
                      Take by
                    </th>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#666',
                        background: '#f8f9fa',
                      }}
                    >
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ textAlign: 'center', padding: '40px', color: '#999', fontSize: '14px' }}>
                        No usage history
                      </td>
                    </tr>
                  ) : (
                    history.map((item, index) => (
                      <tr key={item.id || index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#333' }}>
                          {getFullName(item.doulaUser)}
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#333' }}>
                          {formatDate(item.createdAt)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {history.length > 0 && (
                <div style={{ marginTop: '16px', fontSize: '13px', color: '#666' }}>
                  showing 1 to {history.length} of {history.length} entries.
                </div>
              )}
            </>
          )}
        </div>
      </div>
  )
}
