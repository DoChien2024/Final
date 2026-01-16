# Script to create all module files

# Doulas Module
$doulaTypes = @"
import type { User } from '@/modules/users/types/user.types'

// Doula Types
export interface Doula {
  id: string
  userId: string
  user?: User
  title: string
  description?: string
  businessName?: string
  starAvg: number
  status: 'active' | 'inactive'
  qualifications?: string[]
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
"@

Set-Content -Path "d:\INTERN\FinalPJ\src\modules\doulas\types\doula.types.ts" -Value $doulaTypes -Encoding UTF8
Write-Host " Created doula.types.ts" -ForegroundColor Green
