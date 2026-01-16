import { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import PhoneInput, { type PhoneData } from '@/components/form/PhoneInput'
import type { Doula } from './doula.types'

interface DoulaFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string }) => void
  doula: Doula | null
  isLoading?: boolean
  showPhoneNumber?: boolean
}

export default function DoulaFormModal({
  isOpen,
  onClose,
  onSubmit,
  doula,
  isLoading = false,
  showPhoneNumber = false,
}: DoulaFormModalProps) {
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('')

  useEffect(() => {
    if (!isOpen) return
    
    if (doula) {
      setStatus(doula.status || 'active')
      const userCountryCode = doula.user?.countryCode || ''
      const userPhone = doula.user?.phoneNumber || ''
      setPhoneNumber(userCountryCode && userPhone ? `${userCountryCode} ${userPhone}` : userPhone)
      setCountryCode(userCountryCode)
    } else {
      setStatus('active')
      setPhoneNumber('')
      setCountryCode('')
    }
  }, [doula, isOpen])

  const handlePhoneChange = (fullValue: string, phoneData: PhoneData) => {
    setPhoneNumber(fullValue)
    setCountryCode(phoneData.countryCode)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string } = { status }
    if (showPhoneNumber && phoneNumber.trim()) {
      data.countryCode = countryCode
      data.phoneNumber = phoneNumber.replace(countryCode, '').trim()
    }
    onSubmit(data)
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Update Doula</h2>
          <button onClick={onClose} className="modal-close-btn" disabled={isLoading}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {showPhoneNumber && (
            <div className="form-group">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <PhoneInput
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Phone number"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status <span className="required-asterisk">*</span>
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')}
              className="form-input"
              required
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">
            {isLoading ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>
    </div>
  )
}
