import toast from 'react-hot-toast';

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  statusCode?: number;
  originalError?: any;
}

export interface ApiError {
  response?: {
    status: number;
    data: {
      message?: string;
      code?: string;
      details?: any;
    };
  };
  request?: any;
  message: string;
  code?: string;
}

// Error Categories
export enum ErrorCategory {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
}

// Error Severity Levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Error Handler Class
export class ErrorHandler {
  // Arabic error messages
  private static arabicMessages: Record<string, string> = {
    NETWORK_ERROR: 'خطأ في الاتصال بالشبكة. يرجى التحقق من اتصالك بالإنترنت.',
    TIMEOUT_ERROR: 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
    UNAUTHORIZED: 'يجب تسجيل الدخول للوصول لهذه الصفحة.',
    FORBIDDEN: 'غير مسموح لك بالوصول لهذا المحتوى.',
    NOT_FOUND: 'المحتوى المطلوب غير موجود.',
    VALIDATION_ERROR: 'البيانات المدخلة غير صحيحة.',
    SERVER_ERROR: 'خطأ في الخادم. يرجى المحاولة لاحقاً.',
    UNKNOWN_ERROR: 'حدث خطأ غير متوقع.',
  };

  // Process API errors
  static processApiError(error: ApiError): AppError {
    // Network error (no response)
    if (!error.response && error.request) {
      return {
        code: 'NETWORK_ERROR',
        message: this.arabicMessages.NETWORK_ERROR,
        statusCode: 0,
        originalError: error,
      };
    }

    // HTTP error with response
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      return {
        code: data?.code || `HTTP_${status}`,
        message: data?.message || this.getDefaultMessage(status),
        statusCode: status,
        details: data?.details,
        originalError: error,
      };
    }

    return {
      code: 'CLIENT_ERROR',
      message: error.message || this.arabicMessages.UNKNOWN_ERROR,
      originalError: error,
    };
  }

  // Get default message based on status code
  private static getDefaultMessage(statusCode: number): string {
    switch (statusCode) {
      case 401:
        return this.arabicMessages.UNAUTHORIZED;
      case 403:
        return this.arabicMessages.FORBIDDEN;
      case 404:
        return this.arabicMessages.NOT_FOUND;
      case 422:
        return this.arabicMessages.VALIDATION_ERROR;
      case 500:
        return this.arabicMessages.SERVER_ERROR;
      default:
        return this.arabicMessages.UNKNOWN_ERROR;
    }
  }

  // Handle error with toast notification
  static handleError(error: any, options?: {
    showToast?: boolean;
    customMessage?: string;
  }) {
    const opts = { showToast: true, ...options };
    const appError = this.processApiError(error);
    
    if (opts.showToast) {
      const message = opts.customMessage || appError.message;
      toast.error(message);
    }

    return appError;
  }
}

// Convenience functions
export const handleApiError = (error: any, options?: Parameters<typeof ErrorHandler.handleError>[1]) => {
  return ErrorHandler.handleError(error, options);
};

export default ErrorHandler; 