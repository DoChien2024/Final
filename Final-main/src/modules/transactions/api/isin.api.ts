import axiosInstance from '@/utils/axios'
import type { Isin, IsinHolding } from '../types'
import type { ApiResponse } from '@/types/api.types'
import { mockIsins, mockIsinHolding } from '../mock-data/isin'

/**
 * Fetch list of ISINs
 * Falls back to mock data if API endpoint not available (404)
 * Backend endpoint: GET /api/v1/isins
 */
export const fetchListIsin = async () => {
  try {
    const response = await axiosInstance.get<ApiResponse<Isin[]>>('/isins')
    return response.data
  } catch (error: any) {
    console.warn('⚠️ ISIN API not available, using mock data:', error.message)
    return { data: mockIsins }
  }
}

/**
 * Fetch ISIN holdings by ISIN code
 * Falls back to mock data if API endpoint not available (404)
 * Backend endpoint: GET /api/v1/isins/:isin/holdings
 */
export const fetchIsinHolding = async (isin?: string) => {
  if (!isin) {
    return { data: [] }
  }
  
  try {
    const response = await axiosInstance.get<ApiResponse<IsinHolding[]>>(`/isins/${isin}/holdings`)
    return response.data
  } catch (error: any) {
    console.warn(`⚠️ ISIN Holdings API not available for ${isin}, using mock data:`, error.message)
    return { data: mockIsinHolding[isin] || [] }
  }
}

/**
 * Fetch ISIN detail by ISIN code
 * Falls back to mock data if API endpoint not available (404)
 * Backend endpoint: GET /api/v1/isins/:isin
 */
export const fetchIsinDetail = async (isin: string) => {
  try {
    const response = await axiosInstance.get<ApiResponse<Isin>>(`/isins/${isin}`)
    return response.data
  } catch (error: any) {
    console.warn(`⚠️ ISIN Detail API not available for ${isin}, using mock data:`, error.message)
    const mockIsin = mockIsins.find(i => i.isin === isin)
    return { data: mockIsin || { isin, securityName: '', currency: '' } }
  }
}
