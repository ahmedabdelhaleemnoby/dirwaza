"use server";

import { headers } from "next/headers";

// Types for Plants API
export interface Plant {
  _id: string;
  name: string;
  nameEn: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  descriptionEn: string;
  isAvailable: boolean;
  isOnSale: boolean;
  category: string;
  careLevel: 'easy' | 'medium' | 'hard';
  lightRequirement: 'low' | 'medium' | 'high';
  wateringFrequency: 'daily' | 'weekly' | 'biweekly';
  stock: number;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  discountPercent: number;
  id: string;
  __v: number;
}

export interface PlantsResponse {
  data: Plant[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PlantsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  careLevel?: string;
  lightRequirement?: string;
  isAvailable?: boolean;
  isOnSale?: boolean;
  locale?: string;
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

// Get all plants with SSR support
export async function getPlantsAction(params: PlantsParams = {}) {
  try {
    const apiUrl = getApiUrl();
    
    // Build query parameters
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.category) searchParams.append('category', params.category);
    if (params.minPrice) searchParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) searchParams.append('maxPrice', params.maxPrice.toString());
    if (params.careLevel) searchParams.append('careLevel', params.careLevel);
    if (params.lightRequirement) searchParams.append('lightRequirement', params.lightRequirement);
    if (params.isAvailable !== undefined) searchParams.append('isAvailable', params.isAvailable.toString());
    if (params.isOnSale !== undefined) searchParams.append('isOnSale', params.isOnSale.toString());

    const queryString = searchParams.toString();
    const url = `${apiUrl}/plants${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: await getApiHeaders(params.locale),
      next: { 
        revalidate: 300, // Revalidate every 5 minutes for dynamic data
        tags: ['plants'] 
      },
    });

    if (!response.ok) {
      return {
        success: false,
        data: {
          data: [],
          pagination: {
            page: 1,
            limit: 0, 
            total: 0,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          }
        },
        message: 'فشل في تحميل النباتات'
      };
    }

    const responseData = await response.json();
    
    // Handle both the expected structure and potential variations
    const data: PlantsResponse = {
      data: responseData.data || responseData,
      pagination: responseData.pagination || {
        page: 1,
        limit: responseData.data?.length || 0,
        total: responseData.data?.length || 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    };

    return {
      success: true,
      data,
      message: 'تم تحميل النباتات بنجاح'
    };
  } catch (error) {
    console.error('Get plants error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch plants',
      message: 'فشل في تحميل النباتات',
      data: null
    };
  }
}

// Get single plant by ID
export async function getPlantByIdAction(id: string, locale?: string) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/plants/${id}`, {
      method: 'GET',
      headers: await getApiHeaders(locale),
      next: { 
        revalidate: 600, // Revalidate every 10 minutes
        tags: ['plant', `plant-${id}`] 
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('النبات غير موجود');
      }
      throw new Error(`Failed to fetch plant: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    const data: Plant = responseData.data || responseData;

    return {
      success: true,
      data,
      message: 'تم تحميل بيانات النبات بنجاح'
    };
  } catch (error) {
    console.error('Get plant by ID error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch plant',
      message: 'فشل في تحميل بيانات النبات',
      data: null
    };
  }
}

// Search plants
export async function searchPlantsAction(query: string, locale?: string) {
  return getPlantsAction({
    search: query,
    locale,
    limit: 20
  });
}

// Get plants by category
export async function getPlantsByCategoryAction(category: string, locale?: string) {
  return getPlantsAction({
    category,
    locale,
    limit: 50
  });
}

// Get available plants only
export async function getAvailablePlantsAction(locale?: string) {
  return getPlantsAction({
    isAvailable: true,
    locale
  });
}

// Get plants on sale
export async function getPlantsOnSaleAction(locale?: string) {
  return getPlantsAction({
    isOnSale: true,
    locale
  });
} 