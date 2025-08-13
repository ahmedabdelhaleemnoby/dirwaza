// API Configuration for fetch-based server actions
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://egy.gfoura.com/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

// Get backend base URL (without /api)
export const getBackendUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://egy.gfoura.com/api';
  return apiUrl.replace('/api', '');
};

// Helper to construct full image URL
export const getImageUrl = (imagePath: string) => {
  if (!imagePath) return '/images/placeholder-rest.jpg';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it starts with /, it's a relative path from backend
  if (imagePath.startsWith('/')) {
    return `${getBackendUrl()}${imagePath}`;
  }
  
  // Otherwise, prepend backend URL with /
  return `${getBackendUrl()}/${imagePath}`;
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