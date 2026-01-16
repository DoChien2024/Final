import type { Doula } from '../doula.types'
import '../doula-view.css'

interface DoulaInformationTabProps {
  doula: Doula
}

export const DoulaInformationTab = ({ doula }: DoulaInformationTabProps) => {
  return (
    <>
      {/* Pictures of service */}
      <div style={{ marginBottom: '16px' }}>
        <h3 className="doula-section-title">Pictures of service</h3>
        {doula.photos && doula.photos.length > 0 ? (
          <div className="doula-pictures-grid">
            {doula.photos.map((photo: any) => (
              <div key={photo.id} className="doula-picture-item">
                <img 
                  src={photo.media?.uri || photo.url} 
                  alt="Service picture"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="doula-empty-state">No pictures available</div>
        )}
      </div>

      {/* Categories */}
      <div style={{ marginBottom: '24px' }}>
        <h3 className="doula-section-title">Categories</h3>
        {doula.categories && doula.categories.length > 0 ? (
          <div className="doula-badges-container">
            {doula.categories.map((cat: any) => (
              <span key={cat.id} className="doula-badge">
                {cat.name || cat.title}
              </span>
            ))}
          </div>
        ) : (
          <div className="doula-empty-state">No categories</div>
        )}
      </div>

      {/* Services */}
      {doula.services && doula.services.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 className="doula-section-title">Services</h3>
          <div className="doula-badges-container">
            {doula.services.map((service: any) => (
              <span key={service.id} className="doula-badge">
                {service.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Qualifications */}
      <div>
        <h3 className="doula-section-title">Qualifications</h3>
        {doula.qualifications && doula.qualifications.length > 0 ? (
          <div className="doula-badges-container">
            {doula.qualifications.map((qual: any, index: number) => (
              <span key={index} className="doula-badge-gray">
                {qual}
              </span>
            ))}
          </div>
        ) : (
          <div className="doula-empty-state">No qualification</div>
        )}
      </div>
    </>
  )
}
