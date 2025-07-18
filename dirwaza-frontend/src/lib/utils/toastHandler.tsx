import React from 'react';
import toast, { ToastOptions, ToastPosition, Renderable } from 'react-hot-toast';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface CustomToastOptions extends Omit<ToastOptions, 'position'> {
  position?: ToastPosition;
  showCloseButton?: boolean;
  autoClose?: boolean;
  rtl?: boolean;
}

// Arabic Toast Messages
const arabicMessages = {
  success: {
    default: 'تم بنجاح',
    save: 'تم الحفظ بنجاح',
    update: 'تم التحديث بنجاح',
    delete: 'تم الحذف بنجاح',
    create: 'تم الإنشاء بنجاح',
    send: 'تم الإرسال بنجاح',
    upload: 'تم الرفع بنجاح',
    login: 'تم تسجيل الدخول بنجاح',
    logout: 'تم تسجيل الخروج بنجاح',
    register: 'تم إنشاء الحساب بنجاح',
  },
  error: {
    default: 'حدث خطأ',
    network: 'خطأ في الاتصال بالشبكة',
    server: 'خطأ في الخادم',
    validation: 'خطأ في البيانات المدخلة',
    auth: 'خطأ في المصادقة',
    permission: 'ليس لديك الصلاحية لهذا الإجراء',
    notFound: 'العنصر المطلوب غير موجود',
  },
  warning: {
    default: 'تحذير',
    unsaved: 'لديك تغييرات غير محفوظة',
    limit: 'تم الوصول للحد الأقصى',
    expired: 'انتهت الصلاحية',
  },
  info: {
    default: 'معلومة',
    loading: 'جاري التحميل...',
    processing: 'جاري المعالجة...',
    saving: 'جاري الحفظ...',
  },
  loading: {
    default: 'جاري التحميل...',
    uploading: 'جاري الرفع...',
    processing: 'جاري المعالجة...',
    saving: 'جاري الحفظ...',
    sending: 'جاري الإرسال...',
  },
};

// Default toast configuration
const defaultToastConfig: CustomToastOptions = {
  duration: 4000,
  position: 'top-center',
  rtl: true,
  style: {
    background: '#363636',
    color: '#fff',
    fontFamily: 'var(--font-ibm-plex-sans-arabic)',
    fontSize: '14px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    maxWidth: '500px',
    padding: '16px',
  },
};

// Toast Handler Class
export class ToastHandler {
  // Show success toast
  static success(
    message: string | keyof typeof arabicMessages.success = 'default',
    options?: CustomToastOptions
  ) {
    const text = typeof message === 'string' ? message : arabicMessages.success[message];
    
    return toast.success(text, {
      ...defaultToastConfig,
      ...options,
      icon: '✅',
      style: {
        ...defaultToastConfig.style,
        background: '#10B981',
        color: '#fff',
        ...options?.style,
      },
    });
  }

  // Show error toast
  static error(
    message: string | keyof typeof arabicMessages.error = 'default',
    options?: CustomToastOptions
  ) {
    const text = typeof message === 'string' ? message : arabicMessages.error[message];
    
    return toast.error(text, {
      ...defaultToastConfig,
      duration: 6000, // Longer duration for errors
      ...options,
      icon: '❌',
      style: {
        ...defaultToastConfig.style,
        background: '#EF4444',
        color: '#fff',
        ...options?.style,
      },
    });
  }

  // Show warning toast
  static warning(
    message: string | keyof typeof arabicMessages.warning = 'default',
    options?: CustomToastOptions
  ) {
    const text = typeof message === 'string' ? message : arabicMessages.warning[message];
    
    return toast(text, {
      ...defaultToastConfig,
      ...options,
      icon: '⚠️',
      style: {
        ...defaultToastConfig.style,
        background: '#F59E0B',
        color: '#fff',
        ...options?.style,
      },
    });
  }

  // Show info toast
  static info(
    message: string | keyof typeof arabicMessages.info = 'default',
    options?: CustomToastOptions
  ) {
    const text = typeof message === 'string' ? message : arabicMessages.info[message];
    
    return toast(text, {
      ...defaultToastConfig,
      ...options,
      icon: 'ℹ️',
      style: {
        ...defaultToastConfig.style,
        background: '#3B82F6',
        color: '#fff',
        ...options?.style,
      },
    });
  }

  // Show loading toast
  static loading(
    message: string | keyof typeof arabicMessages.loading = 'default',
    options?: CustomToastOptions
  ) {
    const text = typeof message === 'string' ? message : arabicMessages.loading[message];
    
    return toast.loading(text, {
      ...defaultToastConfig,
      duration: Infinity, // Loading toasts should persist
      ...options,
      style: {
        ...defaultToastConfig.style,
        background: '#6B7280',
        color: '#fff',
        ...options?.style,
      },
    });
  }

  // Promise toast - handles async operations
  static promise<T>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    },
    options?: CustomToastOptions
  ) {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        ...defaultToastConfig,
        ...options,
        style: {
          ...defaultToastConfig.style,
          ...options?.style,
        },
      }
    );
  }

  // Custom toast with custom content
  static custom(content: Renderable, options?: CustomToastOptions) {
    return toast.custom(content, {
      ...defaultToastConfig,
      ...options,
    });
  }

  // Dismiss all toasts
  static dismiss(toastId?: string) {
    toast.dismiss(toastId);
  }

  // Remove all toasts
  static remove(toastId?: string) {
    toast.remove(toastId);
  }

  // Update existing toast
  static update(toastId: string, message: string, type: ToastType = 'info') {
    switch (type) {
      case 'success':
        return toast.success(message, { id: toastId });
      case 'error':
        return toast.error(message, { id: toastId });
      case 'warning':
        return this.warning(message, { id: toastId });
      case 'info':
        return this.info(message, { id: toastId });
      case 'loading':
        return toast.loading(message, { id: toastId });
      default:
        return toast(message, { id: toastId });
    }
  }

  // Show notification for API operations
  static apiOperation<T>(
    operation: () => Promise<T>,
    messages?: {
      loading?: string;
      success?: string | ((data: T) => string);
      error?: string | ((error: unknown) => string);
    }
  ) {
    const defaultMessages = {
      loading: arabicMessages.loading.processing,
      success: arabicMessages.success.default,
      error: arabicMessages.error.default,
      ...messages,
    };

    return this.promise(operation(), defaultMessages);
  }

  // Show toast for form operations
  static formOperation<T>(
    operation: () => Promise<T>,
    operationType: 'save' | 'update' | 'delete' | 'create' = 'save'
  ) {
    const messages = {
      loading: arabicMessages.loading.saving,
      success: arabicMessages.success[operationType],
      error: arabicMessages.error.default,
    };

    return this.promise(operation(), messages);
  }

  // Show confirmation toast
  static confirm(
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
    options?: CustomToastOptions
  ) {
    const confirmToast = this.custom(
      <div className="flex flex-col gap-3 p-2">
        <p className="text-sm font-medium">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => {
              onConfirm();
              toast.dismiss();
            }}
          >
            تأكيد
          </button>
          <button
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={() => {
              onCancel?.();
              toast.dismiss();
            }}
          >
            إلغاء
          </button>
        </div>
      </div>,
      {
        duration: Infinity,
        ...options,
      }
    );

    return confirmToast;
  }

  // Show progress toast
  static progress(message: string, progress: number, options?: CustomToastOptions) {
    return this.custom(
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">{message}</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-600">{Math.round(progress)}%</p>
      </div>,
      {
        duration: Infinity,
        ...options,
      }
    );
  }

  // Authentication success messages
  static authSuccess = {
    login: () => ToastHandler.success('login'),
    logout: () => ToastHandler.success('logout'),
    register: () => ToastHandler.success('register'),
    otpSent: () => ToastHandler.success('send'),
    profileLoaded: () => ToastHandler.success('تم تحميل بيانات المستخدم بنجاح'),
    profileUpdated: () => ToastHandler.success('update'),
    passwordChanged: () => ToastHandler.success('تم تغيير كلمة المرور بنجاح'),
    dataSync: () => ToastHandler.success('تم مزامنة البيانات بنجاح'),
  };
}

// Convenience exports
export const toastSuccess = ToastHandler.success;
export const toastError = ToastHandler.error;
export const toastWarning = ToastHandler.warning;
export const toastInfo = ToastHandler.info;
export const toastLoading = ToastHandler.loading;
export const toastPromise = ToastHandler.promise;
export const toastApiOperation = ToastHandler.apiOperation;
export const toastFormOperation = ToastHandler.formOperation;
export const toastAuthSuccess = ToastHandler.authSuccess;

export default ToastHandler; 