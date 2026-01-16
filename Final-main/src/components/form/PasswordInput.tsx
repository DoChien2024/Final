import { FiEye, FiEyeOff } from 'react-icons/fi'

interface PasswordInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showPassword: boolean
  onToggle: () => void
  hasError?: boolean
}

export default function PasswordInput({ 
  value, 
  onChange, 
  placeholder = 'Password',
  showPassword,
  onToggle,
  hasError = false
}: PasswordInputProps) {
  return (
    <div className="password-wrapper">
      <input
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={hasError ? 'error' : ''}
      />
      <button
        type="button"
        className="toggle-password"
        onClick={onToggle}
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  )
}
