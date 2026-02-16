/**
 * Input validation and sanitization utilities
 */

/**
 * Sanitize string input by removing dangerous characters
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    throw new TypeError('Input must be a string')
  }
  
  return input
    .slice(0, maxLength)
    .trim()
    .replaceAll(/[<>]/g, '') // Remove potential HTML tags
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') {
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

/**
 * Validate number is within range
 */
export function validateNumberInRange(
  value: unknown,
  min: number,
  max: number
): number | null {
  const num = Number(value)
  
  if (Number.isNaN(num) || num < min || num > max) {
    return null
  }
  
  return num
}

/**
 * Validate and sanitize object with expected fields
 */
export function validateObject<T extends Record<string, unknown>>(
  data: unknown,
  schema: Record<string, (value: unknown) => boolean>
): T | null {
  if (!data || typeof data !== 'object') {
    return null
  }
  
  const obj = data as Record<string, unknown>
  
  for (const [key, validator] of Object.entries(schema)) {
    if (!(key in obj) || !validator(obj[key])) {
      return null
    }
  }
  
  return obj as T
}

/**
 * Sanitize URL parameters
 */
export function sanitizeUrlParam(param: string | null, allowedValues?: string[]): string | null {
  if (!param) {
    return null
  }
  
  const sanitized = sanitizeString(param, 100)
  
  if (allowedValues && !allowedValues.includes(sanitized)) {
    return null
  }
  
  return sanitized
}

/**
 * Validate request body size
 */
export function validateBodySize(body: string, maxSizeKb: number = 10): boolean {
  const sizeInKb = new Blob([body]).size / 1024
  return sizeInKb <= maxSizeKb
}
