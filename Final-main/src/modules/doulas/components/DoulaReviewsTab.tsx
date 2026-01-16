import LoadingSpinner from '@/components/ui/LoadingSpinner'
import type { Review } from '@/types/review.types'
import '../doula-view.css'

interface DoulaReviewsTabProps {
  reviews: Review[]
  isLoading: boolean
}

export const DoulaReviewsTab = ({ reviews, isLoading }: DoulaReviewsTabProps) => {
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A'

  return (
    <div className="doula-reviews-grid">
      {/* Average Rating */}
      <div>
        <h3 className="doula-section-title">Average Rating</h3>
        <div className="doula-rating-display">
          {avgRating} <span style={{ color: '#FFC107' }}>⭐</span>
        </div>
        <p className="doula-rating-count">
          {reviews.length > 0 ? `${reviews.length} Review${reviews.length > 1 ? 's' : ''}` : 'No Reviews Yet'}
        </p>
      </div>

      {/* Review History */}
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <h3 className="doula-section-title">Review History</h3>
        {isLoading ? (
          <div className="doula-loading-container">
            <LoadingSpinner />
            <p className="doula-loading-text">Loading reviews...</p>
          </div>
        ) : (
          <>
            <div className="doula-table-container">
              <table className="doula-table" style={{ minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Avatar</th>
                    <th style={{ minWidth: '120px' }}>Full name</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Rating</th>
                    <th style={{ minWidth: '200px' }}>Comment</th>
                    <th style={{ whiteSpace: 'nowrap' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length > 0 ? (
                    reviews.map((review: Review) => (
                      <tr key={review.id}>
                        <td>
                          {review.user?.avatarUrl ? (
                            <img 
                              src={review.user.avatarUrl} 
                              alt="Avatar" 
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
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
                              👤
                            </div>
                          )}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {review.user?.fullName || 
                           `${review.user?.firstName || ''} ${review.user?.lastName || ''}`.trim() || 
                           '-'}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span style={{ color: '#FFC107' }}>{'⭐'.repeat(review.rating)}</span> {review.rating}
                        </td>
                        <td style={{ maxWidth: '300px', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                          {review.comment || '-'}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {new Date(review.createdAt).toLocaleDateString('en-GB')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="doula-table-no-results">
                        No Results
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {reviews.length > 0 && (
              <div className="doula-table-footer">
                showing 1 to {reviews.length} of {reviews.length} entries.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
