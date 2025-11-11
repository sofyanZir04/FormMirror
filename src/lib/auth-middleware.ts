import { NextRequest } from 'next/server'
import { verifyToken, JWTPayload } from './jwt'

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload
}

export const verifyAuthToken = (request: NextRequest): JWTPayload | null => {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value
    
    if (!token) {
      return null
    }

    // Verify and decode token
    const payload = verifyToken(token)
    return payload

  } catch (error) {
    console.error('Auth verification failed:', error)
    return null
  }
}

export const requireAuth = (request: NextRequest): JWTPayload | null => {
  const user = verifyAuthToken(request)
  if (!user) {
    return null
  }
  return user
}