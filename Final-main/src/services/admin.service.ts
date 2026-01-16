import axiosInstance from '../utils/axios'

export interface AdminLoginData {
  username: string
  password: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
}

export const adminService = {
  // Auth APIs only
  login: (data: AdminLoginData) => axiosInstance.post('/admins/auth/login', data),
  logout: () => axiosInstance.post('/admins/auth/logout'),
  changePassword: (data: ChangePasswordData) => axiosInstance.patch('/admins/auth/change-password', data),
  getMe: () => axiosInstance.get('/admins/auth/me'),
  refreshToken: (refreshToken: string) => axiosInstance.post('/admins/auth/refresh-token', { refreshToken }),
}
