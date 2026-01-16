// Address Type
export interface Address {
  id: string
  fullAddress: string
}

// User Type for Doula
export interface DoulaUser {
  id: string
  fullName?: string
  firstName?: string
  middleName?: string
  lastName?: string
  email?: string
  phoneNumber?: string | null
  countryCode?: string
  birthDate?: string
  dateOfBirth?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

// Service Type
export interface DoulaService {
  id: string
  name: string
  description?: string
  price?: number
}

// Picture Type (for main doula picture)
export interface DoulaPicture {
  id: string
  uri: string
  type?: string
  metadata?: {
    thumbnail?: { uri: string; key: string }
    medium?: { uri: string; key: string }
  }
  createdAt?: string
}

// Photo Type (for photos array)
export interface DoulaPhoto {
  id: string
  media: {
    id: string
    uri: string
    type: string
    metadata?: any
  }
}

// Package Type
export interface DoulaPackage {
  id: string
  name: string
  description?: string
  price: number
  duration?: string
  coverPhoto?: string
  imageUrl?: string
  createdAt?: string
  clientCount?: number
  numberOfClients?: number
}

// Category Type
export interface DoulaCategory {
  id: string
  name: string
  title?: string
  picture?: any
}

// Subscription Type for Doula
export interface DoulaSubscription {
  id: string
  name?: string
  title?: string
  amount?: number
  price?: number
  count?: number
  interval?: string
  status?: string
  isActive?: boolean
  startDate?: string
  endDate?: string
}

// Transaction Type for Doula
export interface DoulaTransaction {
  id: string
  amount: number
  status: string
  createdAt: string
}

// Doula Types
export interface Doula {
  id: string
  userId: string
  user?: DoulaUser
  address?: Address | null  // Address at doula level, not user level
  title: string
  description?: string
  businessName?: string
  starAvg: number
  status: 'active' | 'inactive'
  qualifications?: string[]
  services?: DoulaService[]  // Services provided by doula
  picture?: DoulaPicture  // Main doula picture (single object)
  photos?: DoulaPhoto[]  // Service pictures (array)
  categories?: DoulaCategory[]  // Categories
  packages?: DoulaPackage[]  // Service packages
  subscription?: DoulaSubscription  // Subscription of doula
  transactions?: DoulaTransaction[]  // Transaction history
  stripeCustomerId?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

export interface DoulaFormData {
  userId: string
  title: string
  description?: string
  businessName?: string
  qualifications?: string[]
  status?: 'active' | 'inactive'
}


