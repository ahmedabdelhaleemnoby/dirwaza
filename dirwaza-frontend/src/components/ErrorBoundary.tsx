'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void
}

// Enhanced Error Boundary with debugging and reporting capabilities
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    return {
      hasError: true,
      error,
      errorId
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo
    })

    // Send error to reporting service in production
    if (this.props.onError) {
      this.props.onError(error, errorInfo, this.state.errorId)
    }

    // Enhanced error reporting for production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo)
    }
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Example error reporting - replace with your actual service
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        userId: 'anonymous', // Replace with actual user ID if available
        sessionId: this.getSessionId(),
        buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION || 'unknown'
      }

      // Send to your error reporting service
      // await fetch('/api/error-report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // })

      console.log('Error report prepared:', errorReport)
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  private getSessionId = (): string => {
    let sessionId = sessionStorage.getItem('error-session-id')
    if (!sessionId) {
      sessionId = `SESSION_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('error-session-id', sessionId)
    }
    return sessionId
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.handleReset)
      }

      // Default farm-themed error UI
      return (
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full text-center">
            {/* Error Icon */}
            <div className="text-8xl mb-6 animate-pulse">🚨</div>
            
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Something Went Wrong!
            </h1>
            
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Our technical team has been notified.
            </p>

            {/* Error Details for Development */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-gray-100 rounded-lg text-left">
                <h3 className="font-semibold text-gray-800 mb-2">Error Details:</h3>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Error ID:</strong> {this.state.errorId}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Message:</strong> {this.state.error.message}
                </p>
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                    View Stack Trace
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-50 rounded overflow-auto max-h-40 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
              >
                Go to Homepage
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              Error ID: {this.state.errorId}
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Utility hook for reporting errors manually
export const useErrorReporting = () => {
  const reportError = (error: Error, context?: string) => {
    console.error('Manual error report:', error, context)
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error reporting service
      const errorReport = {
        message: error.message,
        stack: error.stack,
        context,
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
      
      // Example: send to your error reporting service
      console.log('Error report:', errorReport)
    }
  }

  return { reportError }
} 