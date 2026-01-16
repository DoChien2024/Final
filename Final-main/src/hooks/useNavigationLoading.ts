import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const useNavigationLoading = () => {
  const [isNavigating, setIsNavigating] = useState(false)
  const location = useLocation()

  // debounce 
  useEffect(() => {
    setIsNavigating(true)
    const timer = setTimeout(() => {
      setIsNavigating(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return isNavigating
}
