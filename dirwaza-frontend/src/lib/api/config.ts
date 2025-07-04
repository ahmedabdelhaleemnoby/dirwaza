// API Configuration for fetch-based server actions
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success?: boolean;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  [key: string]: unknown;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Server Action Response Types
export interface ServerActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export default API_CONFIG; 