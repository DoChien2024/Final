import axiosInstance from '@/utils/axios'
import axios from 'axios'
import { API_ENDPOINTS } from '@/api/api'

export interface SignedUrlResponse {
  message: string
  data: {
    url: string
    fields: {
      acl: string
      success_action_status: string
      bucket: string
      'X-Amz-Algorithm': string
      'X-Amz-Credential': string
      'X-Amz-Date': string
      Policy: string
      'X-Amz-Signature': string
      key: string
    }
  }
}

export interface UploadImageResponse {
  message: string
  data: {
    id: string
    uri: string
    type: string
    converted: boolean
    resourceId: string
    updatedAt: string
    createdAt: string
    metadata: any
    deletedAt: any
  }
}

export const mediaService = {
  /**
   * Step 1: Get signed URL from backend
   */
  async getSignedUrl(type: 'images' | 'videos' = 'images'): Promise<SignedUrlResponse> {
    return axiosInstance.post(API_ENDPOINTS.MEDIA_SIGNED_URL, { type })
  },

  /**
   * Step 2: Upload file to S3 using signed URL
   */
  async uploadToS3(url: string, fields: any, file: File): Promise<string> {
    const formData = new FormData()
    
    // Replace ${filename} với tên file gốc (không encode ở đây)
    const key = fields.key.replace('${filename}', file.name)
    
    // Add all fields from signed URL response (theo thứ tự)
    formData.append('acl', fields.acl)
    formData.append('success_action_status', fields.success_action_status)
    formData.append('bucket', fields.bucket)
    formData.append('X-Amz-Algorithm', fields['X-Amz-Algorithm'])
    formData.append('X-Amz-Credential', fields['X-Amz-Credential'])
    formData.append('X-Amz-Date', fields['X-Amz-Date'])
    formData.append('Policy', fields.Policy)
    formData.append('X-Amz-Signature', fields['X-Amz-Signature'])
    formData.append('key', key)
    
    // Add file last
    formData.append('file', file)
    
    await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    // Return URL với path components được encode riêng lẻ
    const encodedKey = key.split('/').map(encodeURIComponent).join('/')
    return `${url}/${encodedKey}`
  },

  /**
   * Step 3: Create media record in database
   */
  async createMedia(uri: string, type: 'images' | 'videos' = 'images'): Promise<UploadImageResponse> {
    return axiosInstance.post('/medias', { uri, type })
  },
}
