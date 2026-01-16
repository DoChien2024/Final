import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FiArrowLeft } from 'react-icons/fi'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import ClientFormModal from './ClientFormModal'
import { clientService } from './client.service'
import { useToastStore } from '@/store/toastStore'

type TabType = 'packages'

export default function ClientView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab] = useState<TabType>('packages')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const { showToast } = useToastStore()

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientService.getClientById(id!),
    enabled: !!id,
  })

  const client = response?.data
  const packages = client?.packages || []

  const updateMutation = useMutation({
    mutationFn: (data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string }) =>
      clientService.updateClient(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-clients'] })
      showToast('Client updated successfully', 'success')
      setIsEditModalOpen(false)
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update client', 'error')
    },
  })

  const handleSubmit = (data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string }) => {
    updateMutation.mutate(data)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !client) {
    return <div className="error-message">Failed to load client information</div>
  }

  return (
    <>
      <div className="page-container">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <h1 className="page-title">
            Account / Client Management / {client.fullName || `${client.firstName} ${client.lastName}`}
          </h1>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button 
            onClick={() => navigate('/account/client-management')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', fontWeight: 500 }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          <button
            onClick={() => setIsEditModalOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 24px', border: 'none', background: 'transparent', color: '#E91E63', cursor: 'pointer', fontSize: '16px', fontWeight: 500 }}
          >
            <span style={{ fontSize: '18px' }}>✎</span>
            Edit
          </button>
        </div>

        {/* User Info Card */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            {client.picture?.uri || client.avatarUrl ? (
              <img src={client.picture?.uri || client.avatarUrl} alt="Avatar" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>
                👤
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Full name</label>
                  <div style={{ fontWeight: 500 }}>{client.fullName || `${client.firstName} ${client.lastName}` || '-'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Status</label>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <span className={`status-indicator ${client.status === 'active' ? 'active' : 'inactive'}`}></span>
                    {client.status === 'active' ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Email</label>
                  <div>{client.email || '-'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Phone</label>
                  <div>{client.countryCode && client.phoneNumber ? `${client.countryCode} ${client.phoneNumber}` : client.phoneNumber || '-'}</div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Birthday</label>
                  <div>
                    {client.birthDate || client.dateOfBirth 
                      ? new Date(client.birthDate || client.dateOfBirth!).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
                      : '-'}
                  </div>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Address</label>
                <div>{client.address?.fullAddress || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Tab */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '0' }}>
          <div style={{ display: 'flex', gap: '32px', borderBottom: '2px solid #e0e0e0', padding: '0 24px' }}>
            <button style={{ padding: '16px 0', border: 'none', background: 'none', borderBottom: activeTab === 'packages' ? '2px solid #6B21A8' : 'none', marginBottom: '-2px', color: activeTab === 'packages' ? '#6B21A8' : '#666', fontWeight: 500, cursor: 'pointer' }}>
              Packages
            </button>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '24px' }}>
            {activeTab === 'packages' && (
              <div>
                <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>Package Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>Doulas Full Name</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>Start Date</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {packages && packages.length > 0 ? (
                        packages.map((pkg: any) => (
                          <tr key={pkg.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '12px', fontSize: '14px' }}>{pkg.name || '-'}</td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>
                              {pkg.doulaFullName || '-'}
                            </td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>
                              {pkg.startDate ? new Date(pkg.startDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              }) : '-'}
                            </td>
                            <td style={{ padding: '12px', fontSize: '14px' }}>
                              {pkg.status ? (
                                <span style={{
                                  padding: '4px 12px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  background: pkg.status === 'active' ? '#4CAF50' : pkg.status === 'completed' ? '#2196F3' : '#FF5252',
                                  color: 'white'
                                }}>
                                  {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
                                </span>
                              ) : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                            No Results
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {packages && packages.length > 0 && (
                  <div style={{ marginTop: '12px', fontSize: '14px', color: '#666' }}>
                    showing 1 to {packages.length} of {packages.length} entries.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <ClientFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmit}
        client={client}
        isLoading={updateMutation.isPending}
        showPhoneNumber={true}
      />

      <Toast />
    </>
  )
}


