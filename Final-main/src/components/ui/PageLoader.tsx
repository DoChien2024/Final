import { ReactNode } from 'react'
import LoadingSpinner from './LoadingSpinner'

interface PageLoaderProps {
  isLoading: boolean
  children: ReactNode
  minHeight?: string
}

export default function PageLoader({ isLoading, children, minHeight = '400px' }: PageLoaderProps) {
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight,
        width: '100%' 
      }}>
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return <>{children}</>
}
