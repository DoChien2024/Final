import { useAuth } from '@/hooks/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      <div style={{ background: 'white', padding: '24px', borderRadius: '12px', marginTop: '24px' }}>
        <p>Welcome back, <strong>{user?.fullName || 'Admin'}</strong>!</p>
        <p style={{ marginTop: '12px', color: '#757575' }}>Select a menu item from the sidebar to get started.</p>
      </div>
    </div>
  )
}


