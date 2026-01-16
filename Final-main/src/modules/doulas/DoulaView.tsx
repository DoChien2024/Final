import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FiArrowLeft } from 'react-icons/fi'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Toast from '@/components/ui/Toast'
import DoulaFormModal from './DoulaFormModal'
import { doulaService } from './doula.service'
import { useToastStore } from '@/store/toastStore'
import { useDoulaStore } from '@/store'
import { useDoulaData } from './hooks/useDoulaData'
import {
  DoulaInfoCard,
  DoulaInformationTab,
  DoulaSubscriptionTab,
  DoulaPackagesTab,
  DoulaReviewsTab,
} from './components'
import './doula-view.css'

export default function DoulaView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast } = useToastStore()

  const { activeTab, isEditModalOpen, setActiveTab, openEditModal, closeEditModal } = useDoulaStore()
  const { doula, subscription, packages, transactions, reviews } = useDoulaData(id!)

  const updateMutation = useMutation({
    mutationFn: (data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string }) =>
      doulaService.updateDoula(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doula', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-doulas'] })
      showToast('Doula updated successfully', 'success')
      closeEditModal()
    },
    onError: (error: any) => {
      showToast(error?.response?.data?.message || 'Failed to update doula', 'error')
    },
  })

  if (doula.isLoading) {
    return <LoadingSpinner />
  }

  if (doula.error || !doula.data) {
    return <div className="error-message">Failed to load doula information</div>
  }

  const tabs = [
    { key: 'information' as const, label: 'Information' },
    { key: 'subscription' as const, label: 'Subscription' },
    { key: 'packages' as const, label: 'Packages' },
    { key: 'reviews' as const, label: 'Reviews' },
  ]

  return (
    <>
      <div className="doula-page-container">
        {/* Header */}
        <div className="doula-page-header">
          <h1 className="page-title">
            Account / Doula Management / {doula.data.user?.fullName || `${doula.data.user?.firstName} ${doula.data.user?.lastName}`}
          </h1>
        </div>

        {/* Actions */}
        <div className="doula-actions-bar">
          <button onClick={() => navigate('/account/doula-management')} className="doula-back-btn">
            <FiArrowLeft size={20} />
            Back
          </button>
          <button onClick={openEditModal} className="doula-edit-btn">
            <span style={{ fontSize: '18px' }}>✎</span>
            Edit
          </button>
        </div>

        {/* User Info Card */}
        <DoulaInfoCard doula={doula.data} />

        {/* Tabs */}
        <div className="doula-tabs-container">
          <div className="doula-tabs-header">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`doula-tab-button ${activeTab === tab.key ? 'active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="doula-tab-content">
            {activeTab === 'information' && <DoulaInformationTab doula={doula.data} />}
            
            {activeTab === 'subscription' && (
              <DoulaSubscriptionTab
                subscription={subscription.data}
                transactions={transactions.data}
                isLoading={subscription.isLoading || transactions.isLoading}
              />
            )}
            
            {activeTab === 'packages' && (
              <DoulaPackagesTab packages={packages.data} isLoading={packages.isLoading} />
            )}
            
            {activeTab === 'reviews' && (
              <DoulaReviewsTab reviews={reviews.data} isLoading={reviews.isLoading} />
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <DoulaFormModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSubmit={(data) => updateMutation.mutate(data)}
        doula={doula.data}
        isLoading={updateMutation.isPending}
        showPhoneNumber={true}
      />

      <Toast />
    </>
  )
}


