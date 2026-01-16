import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useAuthStore } from '../../store/authStore'
import Layout from '../layout/Layout'

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const checkAuth = useAuthStore(state => state.checkAuth)
  
  useEffect(() => {
    checkAuth()
  }, [checkAuth])
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
