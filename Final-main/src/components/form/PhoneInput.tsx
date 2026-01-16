import { useState, useRef, useEffect } from 'react'
import { FiChevronDown, FiX } from 'react-icons/fi'
import { COUNTRY_CODES, type CountryCode } from '@/constants/countries'

type Country = CountryCode
const countries = COUNTRY_CODES

export interface PhoneData {
  countryCode: string // "+61"
  phoneNumber: string // "43545453"
}

interface PhoneInputProps {
  value: string 
  onChange: (value: string, data: PhoneData) => void // Returns full format and separate data
  placeholder?: string
  disabled?: boolean
  error?: string
}

export default function PhoneInput({ 
  value, 
  onChange, 
  placeholder = 'Phone number',
  disabled = false,
  error 
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Parse current value to get country code and number
  const parsePhoneNumber = (phoneValue: string) => {
    if (!phoneValue) return { dialCode: '', number: '' }
    
    const trimmed = phoneValue.trim()
    // Check if starts with +
    if (trimmed.startsWith('+')) {
      for (const country of countries) {
        if (trimmed.startsWith(country.dialCode)) {
          const number = trimmed.substring(country.dialCode.length).trim()
          return { dialCode: country.dialCode, number }
        }
      }
    }
    
    return { dialCode: '', number: trimmed }
  }

  const { dialCode, number } = parsePhoneNumber(value)
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    dialCode ? countries.find(c => c.dialCode === dialCode) || null : null
  )

  // Update selected country when value changes externally
  useEffect(() => {
    const parsed = parsePhoneNumber(value)
    if (parsed.dialCode) {
      const country = countries.find(c => c.dialCode === parsed.dialCode)
      setSelectedCountry(country || null)
    } else {
      setSelectedCountry(null)
    }
  }, [value])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    const fullValue = number ? `${country.dialCode} ${number}` : country.dialCode
    const phoneData: PhoneData = {
      countryCode: country.dialCode,
      phoneNumber: number
    }
    onChange(fullValue, phoneData)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = e.target.value.replace(/[^\d]/g, '') // Only digits
    if (selectedCountry) {
      const fullValue = newNumber ? `${selectedCountry.dialCode} ${newNumber}` : ''
      const phoneData: PhoneData = {
        countryCode: selectedCountry.dialCode,
        phoneNumber: newNumber
      }
      onChange(fullValue, phoneData)
    } else {
      const phoneData: PhoneData = {
        countryCode: '',
        phoneNumber: newNumber
      }
      onChange(newNumber, phoneData)
    }
  }

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.dialCode.includes(searchTerm)
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Country Selector */}
        <div style={{ position: 'relative', width: '120px' }} ref={dropdownRef}>
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              background: disabled ? '#f5f5f5' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              color: selectedCountry ? 'inherit' : '#999',
            }}
          >
            {selectedCountry ? (
              <span>{selectedCountry.dialCode}</span>
            ) : (
              <span>Code</span>
            )}
            <FiChevronDown size={16} />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1000,
              }}
            >
              {/* Search */}
              <div style={{ padding: '8px', borderBottom: '1px solid #e0e0e0', position: 'sticky', top: 0, background: 'white' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="search"
                    style={{
                      width: '100%',
                      padding: '6px 30px 6px 10px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '4px',
                      fontSize: '13px',
                    }}
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Country List */}
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: 'none',
                    background: selectedCountry?.code === country.code ? '#f0f0f0' : 'transparent',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCountry?.code !== country.code) {
                      e.currentTarget.style.background = '#f9f9f9'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCountry?.code !== country.code) {
                      e.currentTarget.style.background = 'transparent'
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{country.flag}</span>
                  <span>{country.name} {country.dialCode}</span>
                </button>
              ))}

              {filteredCountries.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                  No countries found
                </div>
              )}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="text"
          value={number}
          onChange={handleNumberChange}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            flex: 1,
            padding: '10px 12px',
            border: `1px solid ${error ? '#ef4444' : '#e0e0e0'}`,
            borderRadius: '4px',
            fontSize: '14px',
            background: disabled ? '#f5f5f5' : 'white',
          }}
        />
      </div>
      {error && (
        <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
          {error}
        </span>
      )}
    </div>
  )
}
