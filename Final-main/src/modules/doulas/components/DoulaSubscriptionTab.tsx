import LoadingSpinner from '@/components/ui/LoadingSpinner'
import '../doula-view.css'

interface DoulaSubscriptionTabProps {
  subscription: any
  transactions: any[]
  isLoading: boolean
}

export const DoulaSubscriptionTab = ({ 
  subscription, 
  transactions, 
  isLoading 
}: DoulaSubscriptionTabProps) => {
  if (isLoading) {
    return (
      <div className="doula-loading-container">
        <LoadingSpinner />
        <p className="doula-loading-text">Loading subscription data...</p>
      </div>
    )
  }

  const subscriptionData = subscription
  const subscriptionObj = subscriptionData?.subscription || null
  const subscriptionPlan = subscriptionObj?.name || subscriptionObj?.title || 'Subscription Plan'
  const subscriptionStatus = subscriptionData?.status || 'inactive'
  
  const activePlanName = subscriptionData?.subscriptionPlanName
  let planPrice = subscriptionData?.price || null
  
  if (!planPrice && subscriptionObj?.price && Array.isArray(subscriptionObj.price)) {
    planPrice = subscriptionObj.price.find((p: any) => p.name === activePlanName) || subscriptionObj.price[0]
  }

  return (
    <div className="doula-subscription-grid">
      {/* Subscription Information */}
      <div>
        <h3 className="doula-section-title">Subscription Information</h3>
        {subscriptionObj ? (
          <div className="doula-subscription-card">
            <div className="doula-subscription-header">
              <span style={{ fontSize: '24px' }}>📋</span>
              <div style={{ flex: 1 }}>
                <div className="doula-subscription-title">{subscriptionPlan}</div>
                <span className={`doula-status-label ${
                  subscriptionStatus === 'active' ? 'active' : 
                  subscriptionStatus === 'cancelled' || subscriptionStatus === 'canceled' ? 'cancelled' : 
                  'pending'
                }`}>
                  {subscriptionStatus === 'canceled' ? 'Cancelled' : 
                   subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}
                </span>
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <div className="doula-field-label">Amount</div>
              <div className="doula-field-value">
                {planPrice ? 
                  `$${Number(planPrice.amount).toFixed(0)} - ${planPrice.count} ${planPrice.interval}` 
                  : subscriptionObj?.amount || subscriptionObj?.price ? 
                    `$${Number(subscriptionObj.amount || subscriptionObj.price).toFixed(0)} - ${subscriptionObj.count || 1} ${subscriptionObj.interval || 'week'}` 
                    : 'N/A'
                }
              </div>
            </div>
            
            {(subscriptionData?.createdAt || subscriptionData?.startTime || subscriptionObj.startDate) && (
              <div style={{ marginBottom: '12px' }}>
                <div className="doula-field-label">Started</div>
                <div>{new Date(subscriptionData.createdAt || subscriptionData.startTime || subscriptionObj.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
            )}
            
            {(subscriptionData?.endTime || subscriptionObj.endDate) && (
              <div style={{ marginBottom: '12px' }}>
                <div className="doula-field-label">Ends</div>
                <div>{new Date(subscriptionData.endTime || subscriptionObj.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
            )}
          </div>
        ) : (
          <p className="doula-empty-state">No active subscription</p>
        )}
      </div>

      {/* Billing History */}
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <h3 className="doula-section-title">Billing History</h3>
        <div className="doula-table-container">
          <table className="doula-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction: any) => (
                  <tr key={transaction.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      {new Date(transaction.createdAt).toLocaleString('en-GB', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                      ${Number(transaction.amount || 0).toFixed(2)}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ 
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: transaction.status === 'completed' || transaction.status === 'success' ? '#4CAF50' : 
                               transaction.status === 'failed' ? '#F44336' : '#FF9800'
                      }}>
                        <span style={{ 
                          width: '6px', 
                          height: '6px', 
                          borderRadius: '50%', 
                          background: 'currentColor' 
                        }}></span>
                        {String(transaction.status || 'Success').charAt(0).toUpperCase() + String(transaction.status || 'Success').slice(1)}
                      </span>
                    </td>
                    <td>
                      <a 
                        href="#" 
                        onClick={(e) => e.preventDefault()}
                        style={{ color: '#6B21A8', textDecoration: 'underline', cursor: 'pointer' }}
                      >
                        Invoice
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="doula-table-no-results">
                    No billing history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {transactions.length > 0 && (
          <div className="doula-table-footer">
            showing 1 to {transactions.length} of {transactions.length} entries.
          </div>
        )}
      </div>
    </div>
  )
}
