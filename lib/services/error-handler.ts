import { NextResponse } from "next/server"

export interface AppError {
  code: string
  message: string
  statusCode: number
  details?: any
}

export class ErrorHandler {
  static createError(code: string, message: string, statusCode: number = 500, details?: any): AppError {
    return { code, message, statusCode, details }
  }

  static handleApiError(error: any): NextResponse {
    console.error("API Error:", error)

    // Handle known error types
    if (error.code === 'PGRST116') {
      return NextResponse.json(
        { error: "Resource not found", code: "NOT_FOUND" },
        { status: 404 }
      )
    }

    if (error.code === 'PGRST301') {
      return NextResponse.json(
        { error: "Unauthorized access", code: "UNAUTHORIZED" },
        { status: 401 }
      )
    }

    if (error.message?.includes('JWT')) {
      return NextResponse.json(
        { error: "Authentication failed", code: "AUTH_FAILED" },
        { status: 401 }
      )
    }

    if (error.message?.includes('duplicate key')) {
      return NextResponse.json(
        { error: "Resource already exists", code: "DUPLICATE" },
        { status: 409 }
      )
    }

    // Default error response
    return NextResponse.json(
      { 
        error: "Internal server error", 
        code: "INTERNAL_ERROR",
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    )
  }

  static handleValidationError(errors: string[]): NextResponse {
    return NextResponse.json(
      { 
        error: "Validation failed", 
        code: "VALIDATION_ERROR",
        details: errors 
      },
      { status: 400 }
    )
  }

  static handleAuthError(message: string = "Authentication required"): NextResponse {
    return NextResponse.json(
      { error: message, code: "AUTH_REQUIRED" },
      { status: 401 }
    )
  }

  static handleForbiddenError(message: string = "Access forbidden"): NextResponse {
    return NextResponse.json(
      { error: message, code: "FORBIDDEN" },
      { status: 403 }
    )
  }

  static handleNotFoundError(message: string = "Resource not found"): NextResponse {
    return NextResponse.json(
      { error: message, code: "NOT_FOUND" },
      { status: 404 }
    )
  }

  static handleRateLimitError(resetTime?: number): NextResponse {
    return NextResponse.json(
      { 
        error: "Rate limit exceeded", 
        code: "RATE_LIMITED",
        ...(resetTime && { resetTime })
      },
      { status: 429 }
    )
  }
}

// Error logging service
export class ErrorLogger {
  static async logError(error: any, context?: string, userId?: string): Promise<void> {
    const errorLog = {
      message: error.message || String(error),
      stack: error.stack,
      context,
      userId,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorLogger]', errorLog)
    }

    // In production, you might want to send to an external service
    // like Sentry, LogRocket, or your own logging endpoint
    try {
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to logging service
        // await fetch('/api/logs', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorLog)
        // })
      }
    } catch (loggingError) {
      console.error('Failed to log error:', loggingError)
    }
  }
}

// Custom error classes
export class ValidationError extends Error {
  constructor(message: string, public fields: Record<string, string[]>) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Access forbidden') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class RateLimitError extends Error {
  constructor(message: string = 'Rate limit exceeded', public resetTime?: number) {
    super(message)
    this.name = 'RateLimitError'
  }
}