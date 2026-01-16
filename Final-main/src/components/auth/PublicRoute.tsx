import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Login } from '../../modules/auth'

export default function PublicRoute() {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Login />
}
