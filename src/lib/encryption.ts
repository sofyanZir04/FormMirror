import CryptoJS from 'crypto-js'

// Encryption key - in production, this should be from environment variables
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

// AES encryption for sensitive data
export const encryptData = (data: any): string => {
  try {
    const jsonString = JSON.stringify(data)
    const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
    return encrypted
  } catch (error) {
    console.error('Encryption failed:', error)
    throw new Error('Failed to encrypt data')
  }
}

// AES decryption for sensitive data
export const decryptData = (encryptedData: string): any => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
    const jsonString = decrypted.toString(CryptoJS.enc.Utf8)
    return JSON.parse(jsonString)
  } catch (error) {
    console.error('Decryption failed:', error)
    throw new Error('Failed to decrypt data')
  }
}

// Hash sensitive data (one-way)
export const hashData = (data: string): string => {
  return CryptoJS.SHA256(data).toString()
}

// Generate secure random token
export const generateSecureToken = (length: number = 32): string => {
  return CryptoJS.lib.WordArray.random(length).toString()
}

// Encrypt request payload
export const encryptRequest = (payload: any): { encryptedData: string } => {
  const encrypted = encryptData(payload)
  return { encryptedData: encrypted }
}

// Decrypt request payload
export const decryptRequest = (encryptedPayload: { encryptedData: string }): any => {
  return decryptData(encryptedPayload.encryptedData)
}

// Encrypt response data
export const encryptResponse = (data: any): { success: boolean; encryptedData: string } => {
  const encrypted = encryptData(data)
  return { success: true, encryptedData: encrypted }
}

// Decrypt response data
export const decryptResponse = (response: { encryptedData: string }): any => {
  return decryptData(response.encryptedData)
}