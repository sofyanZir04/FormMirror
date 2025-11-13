// lib/jwt.ts (or wherever this file is)
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '7d' // Token expires in 7 days (matches your comment)

export interface JWTPayload {
  userId: string
  email: string
  plan: 'free' | 'pro'
}

export const signToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
    return decoded
  } catch {
    return null
  }
}

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload
    return decoded
  } catch {
    return null
  }
}

// import jwt from 'jsonwebtoken'

// const JWT_SECRET = process.env.JWT_SECRET! // Token expires in 7 days

// export interface JWTPayload {
//   userId: string
//   email: string
//   plan: 'free' | 'pro'
// }

// export const signToken = (payload: JWTPayload): string => {
//   return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
// }

// export const verifyToken = (token: string): JWTPayload | null => {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload
//     return decoded
//   } catch {
//     // console.error('JWT verification failed:', error)
//     return null
//   }
// }

// export const decodeToken = (token: string): JWTPayload | null => {
//   try {
//     const decoded = jwt.decode(token) as JWTPayload
//     return decoded
//   } catch {
//     // console.error('JWT decode failed:', error)
//     return null
//   }
// }

// export const verifyJwt = async (token: string) => {
//   try {
//     const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
//     return payload
//   } catch {
//     // console.error('JWT verification failed:', error)
//     return null
//   }
// }

// export const decodeJwt = async (token: string) => {
//   try {
//     const payload = decode(token)
//     return payload
//   } catch {
//     // console.error('JWT decode failed:', error)
//     return null
//   }
// }