import { useNavigate } from 'react-router-dom'
import { FiEye } from 'react-icons/fi'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import '../doula-view.css'

interface DoulaPackagesTabProps {
  packages: any[]
  isLoading: boolean
}

export const DoulaPackagesTab = ({ packages, isLoading }: DoulaPackagesTabProps) => {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="doula-loading-container">
        <LoadingSpinner />
        <p className="doula-loading-text">Loading packages...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
      <div className="doula-table-container" style={{ maxHeight: '350px' }}>
        <table className="doula-table" style={{ minWidth: '700px' }}>
          <thead>
            <tr>
              <th style={{ minWidth: '150px' }}>Package Name</th>
              <th style={{ textAlign: 'center', width: '80px' }}>Cover photo</th>
              <th style={{ whiteSpace: 'nowrap' }}>Price</th>
              <th style={{ whiteSpace: 'nowrap' }}>Created date</th>
              <th style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>Number of Clients</th>
              <th style={{ textAlign: 'center', width: '80px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {packages && packages.length > 0 ? (
              packages.map((pkg: any) => (
                <tr key={pkg.id}>
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {pkg.name || '-'}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {pkg.picture?.uri ? (
                      <img 
                        src={pkg.picture.uri} 
                        alt={pkg.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {pkg.price ? pkg.price.replace(/<[^>]*>/g, '').trim() : '-'}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    }) : '-'}
                  </td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {pkg.numberOfClients || 0}
                  </td>
                  <td>
                    <button
                      className="doula-action-btn"
                      onClick={() => navigate(`/account/doula-management/packages/${pkg.id}`)}
                      title="View package details"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="doula-table-no-results">
                  No Results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {packages && packages.length > 0 && (
        <div className="doula-table-footer">
          showing 1 to {packages.length} of {packages.length} entries.
        </div>
      )}
    </div>
  )
}
