"use server";

import { cookies } from "next/headers";

// Shared authentication helper functions for all server actions

// Helper function to get admin authentication headers
export async function getAdminAuthHeaders() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin-auth")?.value;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (adminToken) {
    headers.Authorization = `Bearer ${adminToken}`;
  }
  
  return headers;
}

// Helper function to check admin authentication
export async function checkAdminAuth() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin-auth")?.value;
  const adminUserData = cookieStore.get("admin-user-data")?.value;
  
  if (!adminToken || !adminUserData) {
    return { isAuthenticated: false, error: "غير مصرح للوصول" };
  }
  
  try {
    const userData = JSON.parse(adminUserData);
    if (userData.role !== 'admin') {
      return { isAuthenticated: false, error: "صلاحيات غير كافية" };
    }
    return { isAuthenticated: true };
  } catch {
    return { isAuthenticated: false, error: "بيانات مستخدم غير صحيحة" };
  }
} 