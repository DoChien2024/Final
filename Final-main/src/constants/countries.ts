export interface CountryCode {
  code: string
  name: string
  dialCode: string
  flag: string
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
]

export const COUNTRY_MAP = COUNTRY_CODES.reduce((acc, country) => {
  acc[country.dialCode] = { flag: country.flag, code: country.dialCode }
  return acc
}, {} as { [key: string]: { flag: string; code: string } })

// Helper function to parse phone number and get country info
export const parsePhoneNumber = (phone: string | null | undefined) => {
  if (!phone) return null

  for (const [code, info] of Object.entries(COUNTRY_MAP)) {
    if (phone.startsWith(code)) {
      const number = phone.substring(code.length).trim()
      return { ...info, number }
    }
  }

  return null
}
