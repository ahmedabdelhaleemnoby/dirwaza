'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  const router = useRouter()
  const t = useTranslations('ErrorPage')
  const [isRetrying, setIsRetrying] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  // Log error for debugging
  useEffect(() => {
    console.error('Application Error:', error)
    
    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: sendToErrorReporting(error)
    }
  }, [error])

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      reset()
    } catch (e) {
      console.error('Retry failed:', e)
    } finally {
      setTimeout(() => setIsRetrying(false), 1000)
    }
  }

  const handleGoHome = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-light to-neutral-light overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto">
          {/* Farm Scene Illustration */}
          <div className="relative mb-8">
            {/* Sun */}
            <div className="absolute top-0 right-8 w-16 h-16 bg-secondary rounded-full animate-pulse opacity-80" />
            
            {/* Clouds */}
            <div className="absolute top-4 left-12 w-20 h-8 bg-white rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }} />
            <div className="absolute top-2 right-24 w-16 h-6 bg-white rounded-full opacity-60 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4s' }} />

            {/* Broken Tractor Scene */}
            <div className="relative bg-gradient-to-b from-secondary-light to-primary-light rounded-3xl p-8 mx-auto max-w-2xl shadow-2xl">
              {/* Ground */}
              <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-b-3xl" />
              
              {/* Broken Tractor */}
              <div className="relative flex items-center justify-center mb-4">
                {/* Tractor Body */}
                <div className="relative">
                  {/* Main body */}
                  <div className="w-32 h-20 bg-red-500 rounded-lg relative transform rotate-2 animate-pulse">
                    {/* Smoke from engine */}
                    <div className="absolute -top-4 left-4 space-y-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-gray-400 rounded-full opacity-60 animate-bounce"
                          style={{ 
                            animationDelay: `${i * 0.5}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Broken parts */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-spin" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-gray-600 rounded-sm transform rotate-45 animate-pulse" />
                  </div>
                  
                  {/* Wheels - one flat */}
                  <div className="absolute -bottom-4 left-2 w-8 h-8 bg-black rounded-full" />
                  <div className="absolute -bottom-4 right-2 w-8 h-4 bg-black rounded-b-full transform rotate-12" />
                </div>

                {/* Confused Farmer */}
                <div className="ml-8 animate-bounce" style={{ animationDuration: '2s' }}>
                  {/* Head */}
                  <div className="w-8 h-8 bg-orange-300 rounded-full relative mb-1">
                    {/* Hat */}
                    <div className="absolute -top-2 -left-1 w-10 h-4 bg-yellow-600 rounded-full" />
                    {/* Confused expression */}
                    <div className="absolute top-2 left-1 w-1 h-1 bg-black rounded-full" />
                    <div className="absolute top-2 right-1 w-1 h-1 bg-black rounded-full" />
                    <div className="absolute top-4 left-2 w-4 h-1 bg-black rounded-full transform rotate-12" />
                  </div>
                  {/* Body */}
                  <div className="w-6 h-12 bg-blue-500 rounded-lg mx-auto" />
                  {/* Arms raised in confusion */}
                  <div className="absolute -top-2 -left-2 w-4 h-1 bg-orange-300 rounded-full transform -rotate-45" />
                  <div className="absolute -top-2 -right-2 w-4 h-1 bg-orange-300 rounded-full transform rotate-45" />
                </div>
              </div>

              {/* Withered Plants */}
              <div className="flex justify-around mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="relative animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
                    {/* Plant stem */}
                    <div className="w-1 h-8 bg-yellow-600 mx-auto" />
                    {/* Droopy leaves */}
                    <div className="absolute top-2 -left-2 w-4 h-2 bg-yellow-500 rounded-full transform -rotate-45" />
                    <div className="absolute top-2 -right-2 w-4 h-2 bg-yellow-500 rounded-full transform rotate-45" />
                    <div className="absolute top-4 -left-1 w-3 h-2 bg-brown-400 rounded-full transform -rotate-30" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-6">
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-primary animate-pulse">
              <span className="block text-6xl mb-2">🚜💥</span>
              {t?.('title') || 'حدث خطأ في المزرعة! / Farm Error!'}
            </h1>

            {/* Description */}
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-xl text-primary-dark leading-relaxed">
                {t?.('description') || 'يبدو أن الجرار تعطل والنباتات تحتاج إلى عناية. سنقوم بإصلاح الأمور قريباً!'}
              </p>
              <p className="text-lg text-gray-600">
                {t?.('descriptionEn') || 'Looks like our tractor broke down and the plants need attention. We\'ll fix things up soon!'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="group px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRetrying ? (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t?.('retrying') || 'جاري المحاولة... / Retrying...'}</span>
                  </div>
                ) : (
                  <span className="flex items-center space-x-2 rtl:space-x-reverse">
                    <span>🔧</span>
                    <span>{t?.('tryAgain') || 'إصلاح الجرار / Fix Tractor'}</span>
                  </span>
                )}
              </button>

              <button
                onClick={handleGoHome}
                className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span>🏠</span>
                  <span>{t?.('goHome') || 'العودة للمزرعة / Back to Farm'}</span>
                </span>
              </button>
            </div>

            {/* Developer Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-sm text-gray-600 hover:text-gray-800 font-mono mb-2"
                >
                  🛠️ Debug Info {showDetails ? '▼' : '▶'}
                </button>
                {showDetails && (
                  <div className="space-y-2 text-xs font-mono text-gray-700">
                    <div><strong>Error:</strong> {error.message}</div>
                    <div><strong>Digest:</strong> {error.digest || 'N/A'}</div>
                    <div><strong>Stack:</strong></div>
                    <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded text-xs overflow-auto max-h-40">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            )}

            {/* Contact Support */}
            <p className="text-sm text-gray-500 mt-8">
              {t?.('needHelp') || 'تحتاج مساعدة؟ تواصل معنا: / Need help? Contact us:'} 
              <a href="mailto:support@dirwaza.com" className="text-primary hover:underline ml-1">
                support@dirwaza.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* CSS for additional animations */}
      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        .animate-glitch {
          animation: glitch 0.3s infinite;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
} 