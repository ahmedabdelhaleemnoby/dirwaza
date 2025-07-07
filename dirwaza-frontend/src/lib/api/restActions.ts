"use server";

import { headers } from "next/headers";

// Types for REST API
export interface RestAmenity {
  _id: string;
  icon: string;
  label: string;
}

export interface RestAvailability {
  overnight: {
    checkIn: string;
    checkOut: string;
  };
  withoutOvernight: {
    checkIn: string;
    checkOut: string;
  };
}

export interface Rest {
  _id: string;
  name: string;
  title: string;
  description: string;
  rating: number;
  images: string[];
  features: string[];
  amenities: RestAmenity[];
  price: number;
  location: string;
  href: string;
  isActive: boolean;
  availability: RestAvailability;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RestsResponse {
  rests: Rest[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRests: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface RestsParams {
  page?: number;
  limit?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  features?: string[];
  locale?: string;
}

// Types for Calendar API
export interface CalendarDisabledDate {
  date: string;
  reason: string;
  description: string;
  _id: string;
}

export interface CalendarApiResponse {
  _id: string;
  experienceId: string | null;
  basePrice: number;
  weekendPrice: number;
  disabledDates: CalendarDisabledDate[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Helper function to get API URL
const getApiUrl = () => {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

// Helper function to get headers with language support
async function getApiHeaders(locale?: string) {
  const headersList = await headers();
  const acceptLanguage = locale || headersList.get('accept-language') || 'ar';
  
  return {
    'Content-Type': 'application/json',
    'Accept-Language': acceptLanguage,
    'Accept': 'application/json',
  };
}

// Get all rests with SSR support
export async function getRestsAction(params: RestsParams = {}) {
  try {
    const apiUrl = getApiUrl();
    
    // Build query parameters
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.features?.length) {
      params.features.forEach(feature => searchParams.append('features', feature));
    }

    const queryString = searchParams.toString();
    const url = `${apiUrl}/rests${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: await getApiHeaders(params.locale),
      next: { 
        revalidate: 300, // Revalidate every 5 minutes
        tags: ['rests'] 
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch rests: ${response.status} ${response.statusText}`);
    }

    const data: RestsResponse = await response.json();

    return {
      success: true,
      data,
      message: 'تم تحميل الاستراحات بنجاح'
    };
  } catch (error) {
    console.error('Get rests error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch rests',
      message: 'فشل في تحميل الاستراحات',
      data: null
    };
  }
}

// Get single rest by ID
export async function getRestByIdAction(id: string, locale?: string) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/rests/${id}`, {
      method: 'GET',
      headers: await getApiHeaders(locale),
      next: { 
        revalidate: 600, // Revalidate every 10 minutes
        tags: ['rest', `rest-${id}`] 
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('الاستراحة غير موجودة');
      }
      throw new Error(`Failed to fetch rest: ${response.status} ${response.statusText}`);
    }

    const data: Rest = await response.json();

    return {
      success: true,
      data,
      message: 'تم تحميل بيانات الاستراحة بنجاح'
    };
  } catch (error) {
    console.error('Get rest by ID error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch rest',
      message: 'فشل في تحميل بيانات الاستراحة',
      data: null
    };
  }
}

// Get single rest by href (slug)
export async function getRestByHrefAction(href: string, locale?: string) {
  try {
    const apiUrl = getApiUrl();
    // Clean href to just get the slug part
    const cleanHref = href.replace('/rest/', '').replace('/', '');
    
    const response = await fetch(`${apiUrl}/rests/href/${cleanHref}`, {
      method: 'GET',
      headers: await getApiHeaders(locale),
      next: { 
        revalidate: 600, // Revalidate every 10 minutes
        tags: ['rest', `rest-href-${cleanHref}`] 
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('الاستراحة غير موجودة');
      }
      throw new Error(`Failed to fetch rest: ${response.status} ${response.statusText}`);
    }

    const data: Rest = await response.json();

    return {
      success: true,
      data,
      message: 'تم تحميل بيانات الاستراحة بنجاح'
    };
  } catch (error) {
    console.error('Get rest by href error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch rest',
      message: 'فشل في تحميل بيانات الاستراحة',
      data: null
    };
  }
}

// Search rests
export async function searchRestsAction(query: string, locale?: string) {
  return getRestsAction({
    search: query,
    locale,
    limit: 20
  });
}

// Get popular rests
export async function getPopularRestsAction(locale?: string) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/rests/popular`, {
      method: 'GET',
      headers: await getApiHeaders(locale),
      next: { 
        revalidate: 3600, // Revalidate every hour
        tags: ['rests', 'popular-rests'] 
      },
    });

    if (!response.ok) {
      // Fallback to regular rests if popular endpoint doesn't exist
      return getRestsAction({ limit: 6, locale });
    }

    const data: RestsResponse = await response.json();

    return {
      success: true,
      data,
      message: 'تم تحميل الاستراحات الشائعة بنجاح'
    };
  } catch (error) {
    console.error('Get popular rests error:', error);
    // Fallback to regular rests
    return getRestsAction({ limit: 6, locale });
  }
}

// Get calendar data by ID
export async function getCalendarByIdAction(id: string, locale?: string) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/calendar/${id}`, {
      method: 'GET',
      headers: await getApiHeaders(locale),
      next: { 
        revalidate: 60, // Revalidate every minute for calendar data
        tags: ['calendar', `calendar-${id}`] 
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('بيانات التقويم غير موجودة');
      }
      throw new Error(`Failed to fetch calendar: ${response.status} ${response.statusText}`);
    }

    const response_data = await response.json();
    const data: CalendarApiResponse = response_data.data || response_data;

    return {
      success: true,
      data,
      message: 'تم تحميل بيانات التقويم بنجاح'
    };
  } catch (error) {
    console.error('Get calendar by ID error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch calendar',
      message: 'فشل في تحميل بيانات التقويم',
      data: null
    };
  }
} 