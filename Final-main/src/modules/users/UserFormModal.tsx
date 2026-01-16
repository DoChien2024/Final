import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FiX, FiEye, FiEyeOff } from 'react-icons/fi'
import { createAdminUserSchema, editAdminUserSchema, type AdminUserFormData } from '@/utils/validationSchemas'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useUserFormMutations } from './hooks/useUserFormMutations'
import type { AdminUser } from './user.types'

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  user?: AdminUser | null
}

export default function UserFormModal({
  isOpen,
  onClose,
  user,
}: UserFormModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const mode = user ? 'edit' : 'create'
  const { confirmCreate, confirmUpdate } = useConfirmStore()
  const { createMutation, updateMutation } = useUserFormMutations()
  
  const isLoading = createMutation.isPending || updateMutation.isPending
  
  type FormData = typeof mode extends 'create' 
    ? z.infer<typeof createAdminUserSchema>
    : z.infer<typeof editAdminUserSchema>
  
  // Cấu trúc Form: Dùng chung 1 Form & 1 Schema cho cả Create và Edit
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(mode === 'create' ? createAdminUserSchema : editAdminUserSchema) as any,
    mode: 'onBlur',
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      status: 'active',
    } as FormData,
  })

  const firstNameValue = watch('firstName')
  const lastNameValue = watch('lastName')

  // Cleanup: Đặt hàm reset form vào sự kiện onClose
  const handleClose = () => {
    reset({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      status: 'active',
    })
    setShowPassword(false)
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    
    // Xử lý Dữ liệu: Phân biệt mode bằng cờ (flag), fill dữ liệu bằng defaultValues
    if (user) {
      // Update mode - populate all fields from user data
      reset({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        password: '', // Always empty for edit mode
        status: (user.status as 'active' | 'inactive') || 'active',
      })
    } else {
      // Create mode - reset to default values
      reset({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        status: 'active' as const,
      })
    }
    setShowPassword(false)
  }, [user, isOpen, reset])

  const onSubmitForm = async (data: any) => {
    try {
      // If updating and password is empty, don't send password
      const submitData = user && !data.password 
        ? (() => { const { password, ...rest } = data; return rest })() 
        : data
      
      if (user) {
        confirmUpdate(() => updateMutation.mutate({ id: user.id, data: submitData as AdminUserFormData }), 'this user')
      } else {
        confirmCreate(() => createMutation.mutate(submitData as AdminUserFormData), 'new user')
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{user ? 'Update Admin User' : 'Create Admin User'}</h2>
          <button onClick={handleClose} className="modal-close-btn" disabled={isLoading}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username <span className="required-asterisk">*</span>
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              readOnly={!!user}
              disabled={isLoading}
              autoComplete="off"
              style={user ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : undefined}
              className={`form-input ${errors.username ? 'error' : ''}`}
              {...register('username')}
            />
            {errors.username && <span className="error-message">{errors.username.message}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                First Name <span className="required-asterisk">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="First name"
                disabled={isLoading}
                maxLength={25}
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                {...register('firstName')}
              />
              <div className="char-count">{firstNameValue?.length || 0}/25</div>
              {errors.firstName && <span className="error-message">{errors.firstName.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                Last Name <span className="required-asterisk">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Last name"
                disabled={isLoading}
                maxLength={25}
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                {...register('lastName')}
              />
              <div className="char-count">{lastNameValue?.length || 0}/25</div>
              {errors.lastName && <span className="error-message">{errors.lastName.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email <span className="required-asterisk">*</span>
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              readOnly={!!user}
              disabled={isLoading}
              autoComplete="off"
              style={user ? { backgroundColor: '#f5f5f5', cursor: 'not-allowed' } : undefined}
              className={`form-input ${errors.email ? 'error' : ''}`}
              {...register('email')}
            />
            {errors.email && <span className="error-message">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              {...register('status')}
              className="form-select"
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password {!user && <span className="required-asterisk">*</span>}
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                disabled={isLoading}
                autoComplete="new-password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password.message}</span>}
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (user ? 'Updating...' : 'Creating...') : (user ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
