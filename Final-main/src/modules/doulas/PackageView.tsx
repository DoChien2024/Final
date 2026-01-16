import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FiArrowLeft } from 'react-icons/fi'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { doulaService } from './doula.service'

export default function PackageView() {
  const { packageId } = useParams<{ packageId: string }>()
  const navigate = useNavigate()

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['doula-package', packageId],
    queryFn: () => doulaService.getPackageById(packageId!),
    enabled: !!packageId,
  })

  const packageData = response?.data

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !packageData) {
    return <div className="error-message">Failed to load package information</div>
  }

  const cares = packageData.cares || []

  return (
    <div className="page-container">
        {/* Header */}
        <div className="page-header" style={{ marginBottom: '24px' }}>
          <h1 className="page-title">
            Package / {packageId}
          </h1>
        </div>

        {/* Back Button */}
        <div style={{ marginBottom: '24px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px', fontWeight: 500 }}
          >
            <FiArrowLeft size={20} />
            Back
          </button>
        </div>

        {/* Package Information Card */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Package Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr 1fr', gap: '20px', alignItems: 'start' }}>
            {/* Cover Photo */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Cover photo</div>
              {packageData.picture?.uri ? (
                <img 
                  src={packageData.picture.uri} 
                  alt={packageData.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
              ) : (
                <div style={{ width: '80px', height: '80px', background: '#e0e0e0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>
                  No image
                </div>
              )}
            </div>

            {/* Package Name */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Package Name</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>{packageData.name || '-'}</div>
            </div>

            {/* Short Description */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Short Description</div>
              <div style={{ fontSize: '14px' }}>{packageData.shortDescription || '-'}</div>
            </div>

            {/* Price */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Price</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>
                {packageData.price ? packageData.price.replace(/<[^>]*>/g, '').trim() : '-'}
              </div>
            </div>

            {/* Created Date */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>Created date</div>
              <div style={{ fontSize: '14px' }}>
                {packageData.createdAt ? new Date(packageData.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                }) : '-'}
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>What's Included</div>
            <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap' }}>
              {packageData.description || '-'}
            </div>
          </div>
        </div>

        {/* Clients Table */}
        <div style={{ background: 'white', borderRadius: '8px', padding: '24px' }}>
          <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
            <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'auto', maxWidth: '100%', maxHeight: '500px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px', tableLayout: 'auto' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5', borderBottom: '1px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 600, width: '80px' }}>Avatar</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600, minWidth: '150px' }}>Full name</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600, minWidth: '200px' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>Start date</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>End date</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: 600, whiteSpace: 'nowrap' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cares && cares.length > 0 ? (
                    cares.map((care: any) => (
                      <tr key={care.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          {care.user?.picture?.uri ? (
                            <img 
                              src={care.user.picture.uri} 
                              alt="Avatar" 
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                          ) : (
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e0e0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                              👤
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {care.user?.fullName || `${care.user?.firstName || ''} ${care.user?.lastName || ''}`.trim() || '-'}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px' }}>
                          {care.user?.email || '-'}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {care.createdAt ? new Date(care.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }) : '-'}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {care.createdAt ? new Date(care.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }) : '-'}
                        </td>
                        <td style={{ padding: '12px', fontSize: '14px', textAlign: 'center' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <span className={`status-indicator ${care.status === 'active' ? 'active' : 'inactive'}`}></span>
                            {care.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                        No Results
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {cares && cares.length > 0 && (
              <div style={{ marginTop: '12px', fontSize: '14px', color: '#666', textAlign: 'center' }}>
                showing 1 to {cares.length} of {cares.length} entries.
              </div>
            )}
          </div>
        </div>
      </div>
  )
}
