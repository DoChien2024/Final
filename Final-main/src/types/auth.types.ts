import type { User } from '@/modules/users/user.types'

// Auth Types
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user?: User
  admin?: {
    id: string
    username: string
    firstName: string
    lastName: string
    role: string
    email: string
    status: string
    createdAt: string
    updatedAt: string
    deletedAt: string | null
  }
  tokens: {
    accessToken: string
    refreshToken: string
  }
  role?: 'admin' | 'user' | 'doula'
}
