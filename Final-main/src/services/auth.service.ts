import axiosInstance from '../utils/axios'
import { API_ENDPOINTS } from '../api/api'
import type { 
  ApiResponse, 
  LoginRequest, 
  LoginResponse 
} from '../types'

export const authService = {
  // Admin Login - Endpoint: /admins/auth/login, gửi username + password
  async adminLogin(credentials: { username: string; password: string }): Promise<ApiResponse<LoginResponse>> {
    return axiosInstance.post(API_ENDPOINTS.ADMIN_LOGIN, {
      username: credentials.username,
      password: credentials.password
    })
  },

  // Admin Logout - API sẽ tự động clear tokens
  async adminLogout(): Promise<ApiResponse> {
    return axiosInstance.post(API_ENDPOINTS.ADMIN_LOGOUT)
  },

  // User Login
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return axiosInstance.post(API_ENDPOINTS.AUTH_LOGIN, credentials)
  },
}
