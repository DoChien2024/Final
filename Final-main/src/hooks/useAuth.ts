import { useAuthStore } from '../store/authStore'

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, checkAuth } = useAuthStore()

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
}
