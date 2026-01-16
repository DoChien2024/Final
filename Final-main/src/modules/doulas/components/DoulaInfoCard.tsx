import type { Doula } from '../doula.types'
import '../doula-view.css'

interface DoulaInfoCardProps {
  doula: Doula
}

export const DoulaInfoCard = ({ doula }: DoulaInfoCardProps) => {
  return (
    <div className="doula-info-card">
      <div className="doula-info-header">
        {doula.picture?.uri ? (
          <img src={doula.picture.uri} alt="Avatar" className="doula-avatar" />
        ) : (
          <div className="doula-avatar-placeholder">👤</div>
        )}
        
        <div className="doula-info-grid">
          <div className="doula-grid-5">
            <div>
              <label className="doula-field-label">Full name</label>
              <div className="doula-field-value">
                {doula.user?.fullName || 
                 `${doula.user?.firstName}${doula.user?.middleName ? ' ' + doula.user.middleName : ''} ${doula.user?.lastName}` || 
                 '-'}
              </div>
            </div>
            
            <div>
              <label className="doula-field-label">Status</label>
              <div className="doula-status-badge">
                <span className={`status-indicator ${doula.status === 'active' ? 'active' : 'inactive'}`}></span>
                {doula.status === 'active' ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div>
              <label className="doula-field-label">Email</label>
              <div>{doula.user?.email || '-'}</div>
            </div>
            
            <div>
              <label className="doula-field-label">Phone</label>
              <div>
                {doula.user?.countryCode && doula.user?.phoneNumber 
                  ? `${doula.user.countryCode} ${doula.user.phoneNumber}` 
                  : doula.user?.phoneNumber || '-'}
              </div>
            </div>
            
            <div>
              <label className="doula-field-label">Birthday</label>
              <div>
                {doula.user?.birthDate || doula.user?.dateOfBirth 
                  ? new Date(doula.user.birthDate || doula.user.dateOfBirth!).toLocaleDateString('en-GB', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric' 
                    })
                  : '-'}
              </div>
            </div>
          </div>
          
          <div className="doula-grid-2">
            <div>
              <label className="doula-field-label">Address</label>
              <div>{doula.address?.fullAddress || '-'}</div>
            </div>
            <div>
              <label className="doula-field-label">Business name</label>
              <div>{doula.businessName || '-'}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="doula-description">
        <label className="doula-field-label">About Doulas</label>
        <div>{doula.description || '-'}</div>
      </div>
    </div>
  )
}
