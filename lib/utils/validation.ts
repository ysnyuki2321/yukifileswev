// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation
export function validatePassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number")
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Password must contain at least one special character")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// File validation
export function validateFile(file: File, maxSizeMB: number = 100): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  
  // Check file size
  if (file.size > maxSizeBytes) {
    errors.push(`File size must be less than ${maxSizeMB}MB`)
  }
  
  // Check file type (basic check)
  const allowedTypes = [
    'image/',
    'video/',
    'audio/',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/',
    'application/zip',
    'application/x-rar-compressed'
  ]
  
  const isAllowedType = allowedTypes.some(type => 
    file.type.startsWith(type) || file.type === type
  )
  
  if (!isAllowedType) {
    errors.push("File type not supported")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Username validation
export function validateUsername(username: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  if (username.length < 3) {
    errors.push("Username must be at least 3 characters long")
  }
  
  if (username.length > 20) {
    errors.push("Username must be less than 20 characters")
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers, underscores, and hyphens")
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Phone number validation (basic)
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

// Credit card validation (Luhn algorithm)
export function isValidCreditCard(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s/g, '')
  
  if (!/^\d{13,19}$/.test(cleanNumber)) {
    return false
  }
  
  let sum = 0
  let isEven = false
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

// Form validation helper
export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: Record<keyof T, (value: any) => { isValid: boolean; errors: string[] }>
): {
  isValid: boolean
  errors: Record<keyof T, string[]>
  allErrors: string[]
} {
  const errors: Record<keyof T, string[]> = {} as any
  let allErrors: string[] = []
  let isValid = true
  
  for (const [field, rule] of Object.entries(rules)) {
    const result = rule(data[field])
    errors[field as keyof T] = result.errors
    
    if (!result.isValid) {
      isValid = false
      allErrors.push(...result.errors)
    }
  }
  
  return { isValid, errors, allErrors }
}

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private windowMs: number
  private maxRequests: number
  
  constructor(windowMs: number = 60000, maxRequests: number = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }
  
  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    if (!this.requests.has(identifier)) {
      this.requests.set(identifier, [now])
      return true
    }
    
    const requests = this.requests.get(identifier)!
    const recentRequests = requests.filter(time => time > windowStart)
    
    if (recentRequests.length >= this.maxRequests) {
      return false
    }
    
    recentRequests.push(now)
    this.requests.set(identifier, recentRequests)
    return true
  }
  
  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    if (!this.requests.has(identifier)) {
      return this.maxRequests
    }
    
    const requests = this.requests.get(identifier)!
    const recentRequests = requests.filter(time => time > windowStart)
    
    return Math.max(0, this.maxRequests - recentRequests.length)
  }
  
  reset(identifier: string): void {
    this.requests.delete(identifier)
  }
}