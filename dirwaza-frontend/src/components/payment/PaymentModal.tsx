'use client';

import React, { useEffect, useRef, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentUrl: string;
  onPaymentComplete: (result: 'success' | 'failed' | 'cancelled') => void;
  onPaymentError?: (error: string) => void;
}

export default function PaymentModal({
  isOpen,
  onClose,
  paymentUrl,
  onPaymentComplete,
  onPaymentError
}: PaymentModalProps) {
  const t = useTranslations('PaymentModal');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (!isOpen || !paymentUrl) return;

    // setIsLoading(true);
    setCurrentUrl(paymentUrl);

    // Function to check URL changes
    const checkUrlChange = () => {
      try {
        if (iframeRef.current?.contentWindow) {
          const iframe = iframeRef.current;
          const iframeUrl = iframe.contentWindow!.location.href;
          
          if (iframeUrl !== currentUrl) {
            setCurrentUrl(iframeUrl);
            
            // Check for success/failure patterns in URL
            if (iframeUrl.includes('/success') || iframeUrl.includes('status=success')) {
              onPaymentComplete('success');
            } else if (iframeUrl.includes('/failed') || iframeUrl.includes('status=failed')) {
              onPaymentComplete('failed');
            } else if (iframeUrl.includes('/cancel') || iframeUrl.includes('status=cancel')) {
              onPaymentComplete('cancelled');
            } else if (iframeUrl.includes('/result')) {
              // Generic result page - need to check for specific indicators
              setTimeout(() => {
                checkPaymentResult(iframeUrl);
              }, 1000);
            }
          }
        }
      } catch {
        // Cross-origin restrictions prevent access to iframe content
        // This is expected behavior for security reasons
        console.debug('Cannot access iframe URL due to cross-origin policy');
      }
    };

    // Check for payment result based on URL patterns
    const checkPaymentResult = (url: string) => {
      // Extract query parameters or path segments to determine result
      const urlObj = new URL(url);
      const status = urlObj.searchParams.get('status');
      const success = urlObj.searchParams.get('success');
      
      if (status === 'success' || success === 'true') {
        onPaymentComplete('success');
      } else if (status === 'failed' || success === 'false') {
        onPaymentComplete('failed');
      } else if (status === 'cancelled') {
        onPaymentComplete('cancelled');
      }
    };

    // Set up interval to check URL changes
    const interval = setInterval(checkUrlChange, 1000);

    // Listen for postMessage events from the payment iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== new URL(paymentUrl).origin) {
        return;
      }

      const { type, status, data } = event.data;

      if (type === 'payment_complete') {
        onPaymentComplete(status);
      } else if (type === 'payment_error') {
        onPaymentError?.(data?.message || 'Payment error occurred');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen, paymentUrl, currentUrl, onPaymentComplete, onPaymentError]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    onPaymentError?.('Failed to load payment page');
  };

  const handleClose = () => {
    // Confirm before closing if payment might be in progress
    const shouldClose = window.confirm(t('confirmClose') || 'هل أنت متأكد من إغلاق نافذة الدفع؟ قد يتم فقدان معلومات الدفع.');
    if (shouldClose) {
      onClose();
    }
  };
console.log('====================================');
console.log(paymentUrl);
console.log('====================================');
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl h-full max-h-[90vh] mx-4 bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('title') || 'إتمام الدفع'}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={t('close') || 'إغلاق'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="relative h-full">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-primary" size={32} />
                <p className="text-gray-600">
                  {t('loading') || 'جاري تحميل صفحة الدفع...'}
                </p>
              </div>
            </div>
          )}

          {/* Payment Iframe */}
          <iframe
            // ref={iframeRef}
            src={"https://www.noqoodypay.com/sdk/NoqoodyPaymentPage/#/payment/d8dae94c-c3fe-46fd-8735-3ae24b9a1dca/852519513"}
            className="w-full h-full border-0"
            title={t('paymentFrame') || 'Payment Frame'}
            // onLoad={handleIframeLoad}
            // onError={handleIframeError}
            // sandbox="allow-same-origin allow-scripts allow-forms allow-top-navigation allow-popups"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            {t('securePayment') || 'الدفع آمن ومحمي'}
          </p>
        </div>
      </div>
    </div>
  );
} 