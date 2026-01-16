import { useState } from 'react'
import { FiX } from 'react-icons/fi'
import { useMutation } from '@tanstack/react-query'
import PasswordInput from '../form/PasswordInput'
import { usePasswordToggle } from '../../hooks/useCommon'
import { adminService } from '../../services/admin.service'

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const currentPasswordToggle = usePasswordToggle()
  const newPasswordToggle = usePasswordToggle()
  const confirmPasswordToggle = usePasswordToggle()

  const changePasswordMutation = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) => 
      adminService.changePassword(data),
    onSuccess: () => {
      alert('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setError('')
      onClose()
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.message || 'Failed to change password'
      setError(errorMessage)
    },
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }

    await changePasswordMutation.mutateAsync({
      oldPassword: currentPassword,
      newPassword: newPassword,
    })
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content change-password-modal">
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>

        <h2 className="modal-title">Change Password</h2>
        <p className="modal-subtitle">Setup your password to get started</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password</label>
            <PasswordInput
              value={currentPassword}
              onChange={setCurrentPassword}
              showPassword={currentPasswordToggle.showPassword}
              onToggle={currentPasswordToggle.togglePassword}
            />
          </div>

          <div className="form-group">
            <label>New Password</label>
            <PasswordInput
              value={newPassword}
              onChange={setNewPassword}
              showPassword={newPasswordToggle.showPassword}
              onToggle={newPasswordToggle.togglePassword}
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <PasswordInput
              value={confirmPassword}
              onChange={setConfirmPassword}
              showPassword={confirmPasswordToggle.showPassword}
              onToggle={confirmPasswordToggle.togglePassword}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="btn-submit"
            disabled={changePasswordMutation.isPending}
          >
            {changePasswordMutation.isPending ? 'Changing...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  )
}
