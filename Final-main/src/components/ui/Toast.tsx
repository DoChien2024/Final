import { useEffect } from 'react'
import { FiCheckCircle, FiXCircle, FiAlertCircle, FiX } from 'react-icons/fi'
import { useToastStore } from '../../store/toastStore'

export default function Toast() {
  const { isVisible, message, type, hideToast } = useToastStore()

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        hideToast()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, hideToast])

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FiCheckCircle />
      case 'error':
        return <FiXCircle />
      case 'info':
        return <FiAlertCircle />
      default:
        return <FiCheckCircle />
    }
  }

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <span className="toast-message">{message}</span>
      <button onClick={hideToast} className="toast-close">
        <FiX />
      </button>
    </div>
  )
}
