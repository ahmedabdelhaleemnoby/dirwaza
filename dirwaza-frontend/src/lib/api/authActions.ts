"use server";

import { cookies } from "next/headers";
import { revalidateTag, revalidatePath } from "next/cache";

// Auth Types
export interface LoginCredentials {
  phone: string;
  password?: string;
}

export interface AdminLoginCredentials {
  phone: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    phone: string;
    role: string;
  };
}

export interface RegisterData {
  phone: string;
  name?: string;
  email?: string;
  password?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
  image?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterResponse {
  message: string;
  otp: string;
  user: User;
}

export interface VerifyOtpResponse {
  message: string;
  token: string;
  user: User;
}

export interface OtpRequest {
  phone: string;
}

export interface OtpVerification {
  phone: string;
  code: string;
}

export interface ResetPasswordData {
  phone: string;
  code: string;
  newPassword: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  image?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Helper function to get API URL
const getApiUrl = () => {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

// Helper function to get authentication headers
async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth")?.value;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return headers;
}

// Server Actions

// Send OTP (Resend)
export async function sendOtpAction(data: OtpRequest) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/auth/resend_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to send OTP');
    }

    const result = await response.json();
    return { 
      success: true, 
      data: result,
      message: result.message || 'تم إرسال رمز التحقق بنجاح'
    };
  } catch (error) {
    console.error('Send OTP error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send OTP',
      message: 'فشل في إرسال رمز التحقق'
    };
  }
}

// Verify OTP and Login/Register
export async function verifyOtpAction(data: OtpVerification) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/auth/check_code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Invalid OTP code');
    }

    const result: VerifyOtpResponse = await response.json();

    // Set auth cookies
    const cookieStore = await cookies();
    if (result.token) {
      cookieStore.set("auth", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    
    if (result.user) {
      cookieStore.set("user-data", JSON.stringify(result.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    
    // Revalidate auth-related pages
    revalidatePath('/');
    revalidateTag('auth');
    
    return { 
      success: true, 
      data: result,
      message: result.message || 'تم تسجيل الدخول بنجاح'
    };
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to verify OTP',
      message: 'رمز التحقق غير صحيح'
    };
  }
}

// Admin Login
export async function adminLoginAction(credentials: AdminLoginCredentials) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'بيانات الدخول غير صحيحة');
    }

    const result: AdminLoginResponse = await response.json();

    // Set admin auth cookies
    const cookieStore = await cookies();
    if (result.token) {
      cookieStore.set("admin-auth", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    
    if (result.user) {
      cookieStore.set("admin-user-data", JSON.stringify(result.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }
    
    // Revalidate admin-related pages
    revalidatePath('/dashboard');
    revalidateTag('admin-auth');
    
    return { 
      success: true, 
      data: result,
      message: 'تم تسجيل الدخول بنجاح'
    };
  } catch (error) {
    console.error('Admin login error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to login',
      message: error instanceof Error ? error.message : 'بيانات الدخول غير صحيحة'
    };
  }
}

// Register new user
export async function registerAction(data: RegisterData) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const result: RegisterResponse = await response.json();
    return { 
      success: true, 
      data: result,
      message: result.message || 'تم إنشاء الحساب بنجاح. يرجى التحقق من رمز التأكيد'
    };
  } catch (error) {
    console.error('Register error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Registration failed',
      message: 'فشل في إنشاء الحساب'
    };
  }
}

// Logout
export async function logoutAction() {
  try {
    const apiUrl = getApiUrl();
    
    // Try to call logout endpoint (optional - may fail if token is invalid)
    try {
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        headers: await getAuthHeaders(),
      });
    } catch (error) {
      // Ignore API errors for logout - still clear cookies
      console.warn('Logout API call failed:', error);
    }
    
    // Always clear cookies
    const cookieStore = await cookies();
    cookieStore.delete("auth");
    cookieStore.delete("user-data");
    
    // Revalidate auth-related pages
    revalidatePath('/');
    revalidateTag('auth');
    
    return { 
      success: true, 
      data: { message: 'Logged out successfully' },
      message: 'تم تسجيل الخروج بنجاح'
    };
  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      error: 'Logout failed',
      message: 'فشل في تسجيل الخروج'
    };
  }
}

// Admin Logout
export async function adminLogoutAction() {
  try {
    // Clear admin authentication cookies
    const cookieStore = await cookies();
    cookieStore.delete("admin-auth");
    cookieStore.delete("admin-user-data");
    
    // Revalidate admin pages
    revalidatePath('/admin/login');
    revalidatePath('/dashboard');
    revalidateTag('admin-auth');
    
    return { 
      success: true, 
      data: { message: 'Admin logged out successfully' },
      message: 'تم تسجيل الخروج بنجاح'
    };
  } catch (error) {
    console.error('Admin logout error:', error);
    return { 
      success: false, 
      error: 'Admin logout failed',
      message: 'فشل في تسجيل الخروج'
    };
  }
}



// Get user profile from /user/profile endpoint (for SSR - read-only)
export async function getUserProfileData() {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/user/profile`, {
      method: 'GET',
      headers: await getAuthHeaders(),
      next: { tags: ['user', 'profile'], revalidate: 300 }
    });

    if (!response.ok) {
      // If API fails, try to return cached user data from cookies
      const cookieStore = await cookies();
      const userDataCookie = cookieStore.get("user-data");
      if (userDataCookie?.value) {
        const cachedUser = JSON.parse(userDataCookie.value);
        return {
          success: true,
          data: cachedUser,
          message: 'تم تحميل بيانات المستخدم من الذاكرة المؤقتة'
        };
      }
      
      // Return failure response instead of throwing error (user is not authenticated)
      return {
        success: false,
        error: 'User not authenticated',
        message: 'المستخدم غير مصرح له'
      };
    }

    const result = await response.json();
    
    return { 
      success: result.success || true, 
      data: result.data,
      message: result.message || 'تم تحميل بيانات المستخدم بنجاح'
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { 
      success: false, 
      error: 'Failed to fetch user profile',
      message: 'فشل في تحميل بيانات المستخدم'
    };
  }
}

// Server Action to update user data cookie
export async function updateUserDataCookie(userData: User) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("user-data", JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    
    return { success: true };
  } catch (error) {
    console.error('Update user data cookie error:', error);
    return { success: false, error: 'Failed to update user data cookie' };
  }
}

// Get user profile from /user/profile endpoint (Server Action for form submissions)
export async function getUserProfileAction() {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/user/profile`, {
      method: 'GET',
      headers: await getAuthHeaders(),
      next: { tags: ['user', 'profile'], revalidate: 300 }
    });

    if (!response.ok) {
      // If API fails, try to return cached user data from cookies
      const cookieStore = await cookies();
      const userDataCookie = cookieStore.get("user-data");
      if (userDataCookie?.value) {
        const cachedUser = JSON.parse(userDataCookie.value);
        return {
          success: true,
          data: cachedUser,
          message: 'تم تحميل بيانات المستخدم من الذاكرة المؤقتة'
        };
      }
      
      // Return failure response instead of throwing error (user is not authenticated)
      return {
        success: false,
        error: 'User not authenticated',
        message: 'المستخدم غير مصرح له'
      };
    }

    const result = await response.json();
    
    // Update user data cookie with fresh data if the call was successful
    if (result.success && result.data) {
      await updateUserDataCookie(result.data);
    }
    
    return { 
      success: result.success || true, 
      data: result.data,
      message: result.message || 'تم تحميل بيانات المستخدم بنجاح'
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { 
      success: false, 
      error: 'Failed to fetch user profile',
      message: 'فشل في تحميل بيانات المستخدم'
    };
  }
}

// Update user profile
export async function updateProfileAction(data: UpdateProfileData) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/auth/profile`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    const result = await response.json();
    
    // Update user data cookie
    const cookieStore = await cookies();
    cookieStore.set("user-data", JSON.stringify(result), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    
    // Revalidate profile data
    revalidateTag('auth');
    revalidateTag('profile');
    revalidatePath('/profile');
    
    return { 
      success: true, 
      data: result,
      message: 'تم تحديث الملف الشخصي بنجاح'
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update profile',
      message: 'فشل في تحديث الملف الشخصي'
    };
  }
}

// // Change password
// export async function changePasswordAction(data: ChangePasswordData) {
//   try {
//     const apiUrl = getApiUrl();
//     const response = await fetch(`${apiUrl}/auth/change-password`, {
//       method: 'PUT',
//       headers: await getAuthHeaders(),
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to change password');
//     }

//     const result = await response.json();
    
//     return { 
//       success: true, 
//       data: result,
//       message: 'تم تغيير كلمة المرور بنجاح'
//     };
//   } catch (error) {
//     console.error('Change password error:', error);
//     return { 
//       success: false, 
//       error: error instanceof Error ? error.message : 'Failed to change password',
//       message: 'فشل في تغيير كلمة المرور'
//     };
//   }
// }

// // Reset password
// export async function resetPasswordAction(data: ResetPasswordData) {
//   try {
//     const apiUrl = getApiUrl();
//     const response = await fetch(`${apiUrl}/auth/reset-password`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to reset password');
//     }

//     const result = await response.json();
    
//     return { 
//       success: true, 
//       data: result,
//       message: 'تم إعادة تعيين كلمة المرور بنجاح'
//     };
//   } catch (error) {
//     console.error('Reset password error:', error);
//     return { 
//       success: false, 
//       error: error instanceof Error ? error.message : 'Failed to reset password',
//       message: 'فشل في إعادة تعيين كلمة المرور'
//     };
//   }
// }

// // Upload profile image
// export async function uploadProfileImageAction(file: File) {
//   try {
//     const apiUrl = getApiUrl();
//     const formData = new FormData();
//     formData.append('image', file);

//     // Get auth headers without Content-Type for FormData
//     const cookieStore = await cookies();
//     const token = cookieStore.get("auth")?.value;
//     const headers: Record<string, string> = {};
//     if (token) {
//       headers.Authorization = `Bearer ${token}`;
//     }

//     const response = await fetch(`${apiUrl}/auth/upload-image`, {
//       method: 'POST',
//       headers,
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to upload image');
//     }

//     const result = await response.json();
    
//     // Revalidate profile data
//     revalidateTag('auth');
//     revalidateTag('profile');
    
//     return { 
//       success: true, 
//       data: result,
//       message: 'تم رفع الصورة بنجاح'
//     };
//   } catch (error) {
//     console.error('Upload profile image error:', error);
//     return { 
//       success: false, 
//       error: error instanceof Error ? error.message : 'Failed to upload image',
//       message: 'فشل في رفع الصورة'
//     };
//   }
// }

// // Verify token (check if user is authenticated)
// export async function verifyTokenAction() {
//   try {
//     const apiUrl = getApiUrl();
//     const response = await fetch(`${apiUrl}/auth/verify-token`, {
//       method: 'GET',
//       headers: await getAuthHeaders(),
//       next: { tags: ['auth-verify'], revalidate: 60 }
//     });

//     if (!response.ok) {
//       throw new Error('Token verification failed');
//     }

//     const result = await response.json();
    
//     return { 
//       success: true, 
//       data: result,
//       message: 'تم التحقق من الرمز المميز بنجاح'
//     };
//   } catch (error) {
//     console.error('Verify token error:', error);
//     return { 
//       success: false, 
//       error: 'Token verification failed',
//       message: 'فشل في التحقق من الرمز المميز'
//     };
//   }
// }

// // Delete account
// export async function deleteAccountAction(password?: string) {
//   try {
//     const apiUrl = getApiUrl();
//     const response = await fetch(`${apiUrl}/auth/account`, {
//       method: 'DELETE',
//       headers: await getAuthHeaders(),
//       body: password ? JSON.stringify({ password }) : undefined,
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Failed to delete account');
//     }

//     const result = await response.json();
    
//     // Clear cookies after successful account deletion
//     const cookieStore = await cookies();
//     cookieStore.delete("auth");
//     cookieStore.delete("user-data");
    
//     // Revalidate all pages
//     revalidatePath('/');
//     revalidateTag('auth');
    
//     return { 
//       success: true, 
//       data: result,
//       message: 'تم حذف الحساب بنجاح'
//     };
//   } catch (error) {
//     console.error('Delete account error:', error);
//     return { 
//       success: false, 
//       error: error instanceof Error ? error.message : 'Failed to delete account',
//       message: 'فشل في حذف الحساب'
//     };
//   }
// }

// Get user bookings from /user/bookings endpoint (for SSR - read-only)
export async function getUserBookingsData() {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/user/bookings`, {
      method: 'GET',
      headers: await getAuthHeaders(),
      next: { tags: ['user', 'bookings'], revalidate: 300 }
    });

    if (!response.ok) {
      // Return empty bookings array if user is not authenticated or API fails
      return {
        success: true,
        data: [],
        message: 'لا توجد حجوزات'
      };
    }

    const result = await response.json();
    
    return { 
      success: result.success || true, 
      data: result.data || [],
      message: result.message || 'تم تحميل الحجوزات بنجاح'
    };
  } catch (error) {
    console.error('Get user bookings error:', error);
    return { 
      success: true, 
      data: [],
      message: 'لا توجد حجوزات'
    };
  }
}

// Get contact info from /contact-info endpoint (for SSR - read-only)
export async function getContactInfoData() {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/contact-info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['contact-info'], revalidate: 3600 } // Cache for 1 hour since contact info changes infrequently
    });

    if (!response.ok) {
      // Return fallback data if API fails
      return {
        success: false,
        data: null,
        message: 'فشل في تحميل معلومات التواصل'
      };
    }

    const result = await response.json();
    
    return { 
      success: result.success || true, 
      data: result.data || null,
      message: result.message || 'تم تحميل معلومات التواصل بنجاح'
    };
  } catch (error) {
    console.error('Get contact info error:', error);
    return { 
      success: false, 
      data: null,
      message: 'فشل في تحميل معلومات التواصل'
    };
  }
}

// Get contact info from /contact-info endpoint (Client-side action for use in components)
export async function getContactInfoAction() {
  'use server';
  
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/contact-info`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['contact-info'], revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contact info');
    }

    const result = await response.json();
    
    return { 
      success: result.success || true, 
      data: result.data || null,
      message: result.message || 'Contact info loaded successfully'
    };
  } catch (error) {
    console.error('Get contact info action error:', error);
    return { 
      success: false, 
      data: null,
      message: 'Failed to load contact information'
    };
  }
}

// Get current auth state from server-side cookies
export async function getAuthStateAction() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth")?.value;
    const userDataCookie = cookieStore.get("user-data")?.value;
    
    let user = null;
    if (userDataCookie) {
      try {
        user = JSON.parse(userDataCookie);
      } catch (e) {
        console.error('Failed to parse user data from cookie:', e);
      }
    }
    
    return {
      success: true,
      data: {
        user,
        token,
        isAuthenticated: !!(token && user)
      }
    };
  } catch (error) {
    console.error('Get auth state error:', error);
    return {
      success: false,
      data: {
        user: null,
        token: null,
        isAuthenticated: false
      }
    };
  }
} 