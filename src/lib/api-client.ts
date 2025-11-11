import { encryptRequest, decryptResponse } from './encryption'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  // Encrypted POST request
  async encryptedPost<T = any>(
    endpoint: string, 
    payload: any, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      console.log('🔐 Encrypting request payload for:', endpoint)
      
      // Encrypt the payload
      const encryptedPayload = encryptRequest(payload)
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Encrypted': 'true', // Flag to indicate encrypted data
          ...options.headers,
        },
        body: JSON.stringify(encryptedPayload),
        credentials: 'include',
        ...options,
      })

      const responseData = await response.json()
      console.log('📦 Encrypted response received:', { status: response.status })

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || `HTTP ${response.status}`,
        }
      }

      // If response is encrypted, decrypt it
      if (responseData.encryptedData) {
        console.log('🔓 Decrypting response data')
        const decryptedData = decryptResponse(responseData)
        return {
          success: true,
          data: decryptedData,
          message: decryptedData.message,
        }
      }

      // Return unencrypted response as-is
      return {
        success: responseData.success !== false,
        data: responseData,
        message: responseData.message,
        error: responseData.error,
      }

    } catch (error) {
      console.error('🚨 API request failed:', error)
      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  // Regular POST request (for non-sensitive data)
  async post<T = any>(
    endpoint: string, 
    payload: any, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
        ...options,
      })

      const responseData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || `HTTP ${response.status}`,
        }
      }

      return {
        success: responseData.success !== false,
        data: responseData,
        message: responseData.message,
        error: responseData.error,
      }

    } catch (error) {
      console.error('🚨 API request failed:', error)
      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }

  // GET request
  async get<T = any>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          ...options.headers,
        },
        credentials: 'include',
        ...options,
      })

      const responseData = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || `HTTP ${response.status}`,
        }
      }

      return {
        success: responseData.success !== false,
        data: responseData,
        message: responseData.message,
        error: responseData.error,
      }

    } catch (error) {
      console.error('🚨 API request failed:', error)
      return {
        success: false,
        error: 'Network error. Please try again.',
      }
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient()

// Convenience methods
export const encryptedApiCall = {
  login: (email: string, password: string) =>
    apiClient.encryptedPost('/api/auth/login', { email, password }),
  
  register: (email: string, password: string, name?: string) =>
    apiClient.encryptedPost('/api/register', { email, password, name }),
  
  checkAuth: () =>
    apiClient.get('/api/auth/me'),
  
  logout: () =>
    apiClient.post('/api/auth/logout', {}),
}