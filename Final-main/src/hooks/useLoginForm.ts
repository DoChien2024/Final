import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'

export function useLoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: { username?: string; password?: string } = {}
    if (!username.trim()) newErrors.username = 'Username or email is required'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    setErrors({})
    try {
      await login({ username, password })
      navigate('/dashboard')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Invalid credentials. Please try again.'
      setErrors({ password: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    errors,
    isLoading,
    handleLogin,
  }
}
