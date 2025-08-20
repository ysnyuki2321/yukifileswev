import StartupLogger from './startup-logger'

// Create a singleton logger instance
const logger = new StartupLogger()

// Export the logger instance
export { logger }

// Export the logger class for creating new instances
export { default as StartupLogger } from './startup-logger'

// Convenience functions for logging
export const logInfo = (service: string, step: string, message: string, options?: any) => {
  logger.logInfo(service, step, message, options)
}

export const logSuccess = (service: string, step: string, message: string, options?: any) => {
  logger.logSuccess(service, step, message, options)
}

export const logError = (service: string, step: string, message: string, options?: any) => {
  logger.logError(service, step, message, options)
}

export const logWarn = (service: string, step: string, message: string, options?: any) => {
  logger.logWarn(service, step, message, options)
}

// Example usage in your application:
/*
import { logInfo, logError, logSuccess } from '@/lib/logger'

// Log application events
logInfo('api', 'fileUpload', 'Processing file upload', { file: 'document.pdf' })
logSuccess('api', 'fileUpload', 'File uploaded successfully', { size: '2.5MB' })
logError('api', 'fileUpload', 'Upload failed: file too large', { maxSize: '10MB' })
*/