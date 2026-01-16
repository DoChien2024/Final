import { useEffect, useState } from 'react'
import { FiX } from 'react-icons/fi'
import PhoneInput, { type PhoneData } from '@/components/form/PhoneInput'
import type { Client } from './client.types'

interface ClientFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { status: 'active' | 'inactive'; phoneNumber?: string; countryCode?: string }) => void
  client: Client | null
  isLoading?: boolean
  showPhoneNumber?: boolean
}

export default function ClientFormModal({
  isOpen,
  onClose,
  onSubmit,
  client,
  isLoading = false,
  showPhoneNumber = false,
}: ClientFormModalProps) {
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [countryCode, setCountryCode] = useState('')

  useEffect(() => {
    if (!isOpen) return
    
    if (client) {
      setStatus(client.status || 'active')
      const userCountryCode = client.countryCode || ''
      const userPhone = client.phoneNumber || ''
      setPhoneNumber(userCountryCode && userPhone ? `${userCountryCode} ${userPhone}` : userPhone)
      setCountryCode(userCountryCode)
    } else {
      setStatus('active')
      setPhoneNumber('')
      setCountryCode('')
    }
  }, [client, isOpen])

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
          <h2 className="modal-title">Update Client</h2>
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
