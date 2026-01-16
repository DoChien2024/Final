interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  fullScreen?: boolean
}

export default function LoadingSpinner({ size = 'medium', fullScreen = false }: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className={`spinner spinner-${size}`}></div>
      </div>
    )
  }

  return <div className={`spinner spinner-${size}`}></div>
}
