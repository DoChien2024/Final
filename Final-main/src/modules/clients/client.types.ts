import type { Media } from '@/types/media.types'

// Client-specific package type
export interface ClientPackage {
  id: string
  name: string
  description?: string
  price: number
  coverPhoto?: string
  imageUrl?: string
  createdAt?: string
  doulaFullName?: string
  doula?: {
    id: string
    user?: {
      firstName?: string
      lastName?: string
      fullName?: string
    }
  }
  startDate?: string
  status?: 'active' | 'inactive' | 'completed'
}

// Address Type
export interface Address {
  id?: string
  fullAddress: string
  latitude?: number
  longitude?: number
}

// Client User Type
export interface Client {
  id: string
  fullName: string
  firstName: string
  middleName?: string
  lastName: string
  email: string
  phoneNumber?: string
  countryCode?: string
  role?: 'user'
  status: 'active' | 'inactive'
  verifiedEmail: boolean
  verifiedPhoneNumber: boolean
  birthDate?: string
  dateOfBirth?: string
  address?: Address
  avatarUrl?: string
  picture?: Media
  packages?: ClientPackage[]  // Packages that client has purchased
  createdAt: string
  updatedAt: string
}

export interface ClientFormData {
  status: 'active' | 'inactive'
  phoneNumber?: string
  countryCode?: string
}
