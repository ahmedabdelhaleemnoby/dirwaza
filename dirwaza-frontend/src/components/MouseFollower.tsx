'use client'

  import { useState, useEffect } from 'react';
  import { ChevronLeft, Home, Search, TreePine, Flower2, Leaf } from 'lucide-react';
  
  export default function MouseFollower() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isVisible, setIsVisible] = useState(false);
    const [animateElements, setAnimateElements] = useState(false);
  
    useEffect(() => {
      setIsVisible(true);
      setTimeout(() => setAnimateElements(true), 500);
      
      const handleMouseMove = (e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      };
  
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
  
    const handleGoBack = () => {
      if (typeof window !== 'undefined') {
        window.history.back();
      }
    };
  
    const handleGoHome = () => {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    };
  
    return (
      <div className="min-h-screen relative overflow-hidden" style={{
        background: `linear-gradient(135deg, 
          oklch(0.2845 0.0608 148.3) 0%, 
          oklch(0.4461 0.0263 256.8) 50%, 
          oklch(0.2845 0.0608 148.3) 100%)`
      }}>
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full animate-float-slow" style={{
            background: 'oklch(0.8355 0.1715 83.43)'
          }} />
          <div className="absolute top-40 right-32 w-24 h-24 rounded-full animate-float-medium" style={{
            background: 'oklch(0.8703 0.1292 114.07)'
          }} />
          <div className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full animate-float-fast" style={{
            background: 'oklch(0.9276 0.0058 264.53)'
          }} />
        </div>
  
        {/* Moving grass-like elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 w-1 bg-gradient-to-t animate-sway"
              style={{
                left: `${(i * 7) + Math.random() * 5}%`,
                height: `${20 + Math.random() * 40}px`,
                background: `linear-gradient(to top, oklch(0.8355 0.1715 83.43), oklch(0.8703 0.1292 114.07))`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
  
        {/* Floating farm elements */}
        <div className="absolute inset-0 pointer-events-none">
          <TreePine 
            className={`absolute top-1/4 left-1/6 w-8 h-8 transition-all duration-1000 ${animateElements ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ color: 'oklch(0.8703 0.1292 114.07)' }}
          />
          <Flower2 
            className={`absolute top-1/3 right-1/5 w-6 h-6 transition-all duration-1000 delay-300 animate-pulse ${animateElements ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ color: 'oklch(0.8355 0.1715 83.43)' }}
          />
          <Leaf 
            className={`absolute bottom-1/3 left-1/5 w-7 h-7 transition-all duration-1000 delay-500 animate-bounce ${animateElements ? 'opacity-30 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ color: 'oklch(0.8703 0.1292 114.07)' }}
          />
          <TreePine 
            className={`absolute top-1/2 right-1/4 w-10 h-10 transition-all duration-1000 delay-700 ${animateElements ? 'opacity-25 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ color: 'oklch(0.8355 0.1715 83.43)' }}
          />
        </div>
  
        {/* Particle system */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? 'oklch(0.8703 0.1292 114.07)' : 
                           i % 3 === 1 ? 'oklch(0.8355 0.1715 83.43)' : 
                           'oklch(0.9276 0.0058 264.53)',
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
  
        {/* Interactive mouse follower */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-300 ease-out animate-pulse-slow"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: `radial-gradient(circle, oklch(0.8355 0.1715 83.43), transparent 70%)`
          }}
        />
  
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            {/* Arabic heading */}
            <div className={`mb-6 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'oklch(0.9559 0.0106 106.6)' }}>
                مزرعة دروازة
              </h3>
              <div className="w-24 h-1 mx-auto rounded-full animate-shimmer" style={{
                background: `linear-gradient(90deg, oklch(0.8355 0.1715 83.43) 0%, oklch(0.8703 0.1292 114.07) 50%, oklch(0.8355 0.1715 83.43) 100%)`
              }} />
            </div>
  
            {/* 404 Number with enhanced effects */}
            <div className="relative mb-8 group">
              <h1 className={`text-8xl md:text-[10rem] font-black select-none transition-all duration-500 group-hover:scale-110 ${animateElements ? 'animate-glow' : ''}`} style={{
                background: `linear-gradient(45deg, oklch(0.8703 0.1292 114.07), oklch(0.8355 0.1715 83.43), oklch(0.9276 0.0058 264.53))`,
                backgroundSize: '200% 200%',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                animation: 'gradient-shift 3s ease-in-out infinite'
              }}>
                404
              </h1>
              
              {/* Shadow layers */}
              <div className="absolute inset-0 text-8xl md:text-[10rem] font-black opacity-30 animate-pulse-slow" style={{
                color: 'oklch(0.4461 0.0263 256.8)',
                transform: 'translate(2px, 2px)'
              }}>
                404
              </div>
              <div className="absolute inset-0 text-8xl md:text-[10rem] font-black opacity-20 animate-float-medium" style={{
                color: 'oklch(0.8355 0.1715 83.43)',
                transform: 'translate(-1px, -1px)'
              }}>
                404
              </div>
            </div>
  
            {/* Error messages in Arabic and English */}
            <div className="mb-8 space-y-4">
              <h2 className={`text-2xl md:text-3xl font-bold mb-4 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ color: 'oklch(0.9559 0.0106 106.6)' }}>
                الصفحة غير موجودة
              </h2>
              <p className={`text-lg mb-2 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ color: 'oklch(0.9713 0.0025 165.08)' }}>
                عذراً، لم نتمكن من العثور على الصفحة المطلوبة
              </p>
              <p className={`text-sm max-w-md mx-auto leading-relaxed transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ color: 'oklch(0.9846 0.0017 247.84)' }}>
                The page you&apos;re looking for might have been moved or doesn&apos;t exist in our farm estate directory
              </p>
            </div>
  
            {/* Action buttons with farm theme */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
              <button
                onClick={handleGoHome}
                className="group flex items-center gap-3 px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 animate-pulse-button"
                style={{
                  background: `linear-gradient(135deg, oklch(0.8355 0.1715 83.43), oklch(0.8703 0.1292 114.07))`,
                  color: 'oklch(0.2845 0.0608 148.3)',
                  boxShadow: '0 0 30px oklch(0.8355 0.1715 83.43 / 0.3)'
                }}
              >
                <Home className="w-5 h-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                العودة للرئيسية
              </button>
              
              <button
                onClick={handleGoBack}
                className="group flex items-center gap-3 px-8 py-4 rounded-full font-semibold backdrop-blur-md border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95"
                style={{
                  background: 'oklch(0.9276 0.0058 264.53 / 0.1)',
                  color: 'oklch(0.9559 0.0106 106.6)',
                  borderColor: 'oklch(0.8355 0.1715 83.43)'
                }}
              >
                <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
                رجوع
              </button>
            </div>
  
            {/* Search suggestion */}
            <div className={`flex items-center justify-center gap-2 mb-8 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ color: 'oklch(0.9846 0.0017 247.84)' }}>
              <Search className="w-4 h-4 animate-pulse" />
              <span className="text-sm">جرب البحث عما تحتاجه</span>
            </div>
  
            {/* Farm decorative elements */}
            <div className="flex justify-center gap-4 mt-8">
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ 
                background: 'oklch(0.8355 0.1715 83.43)',
                animationDelay: '0s' 
              }} />
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ 
                background: 'oklch(0.8703 0.1292 114.07)',
                animationDelay: '0.2s' 
              }} />
              <div className="w-3 h-3 rounded-full animate-bounce" style={{ 
                background: 'oklch(0.9276 0.0058 264.53)',
                animationDelay: '0.4s' 
              }} />
            </div>
          </div>
        </div>
  
        <style jsx>{`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          
          @keyframes float-medium {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-3deg); }
          }
          
          @keyframes float-fast {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-10px) rotate(2deg); }
          }
          
          @keyframes sway {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(2deg); }
            75% { transform: rotate(-2deg); }
          }
          
          @keyframes twinkle {
            0%, 100% { opacity: 0; transform: scale(0.5); }
            50% { opacity: 1; transform: scale(1); }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes glow {
            0%, 100% { filter: drop-shadow(0 0 10px oklch(0.8355 0.1715 83.43 / 0.5)); }
            50% { filter: drop-shadow(0 0 20px oklch(0.8703 0.1292 114.07 / 0.8)); }
          }
          
          @keyframes pulse-slow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          
          @keyframes pulse-button {
            0%, 100% { box-shadow: 0 0 30px oklch(0.8355 0.1715 83.43 / 0.3); }
            50% { box-shadow: 0 0 40px oklch(0.8355 0.1715 83.43 / 0.5); }
          }
          
          .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
          .animate-float-medium { animation: float-medium 3s ease-in-out infinite; }
          .animate-float-fast { animation: float-fast 2s ease-in-out infinite; }
          .animate-sway { animation: sway 3s ease-in-out infinite; }
          .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
          .animate-shimmer { animation: shimmer 2s linear infinite; }
          .animate-glow { animation: glow 2s ease-in-out infinite; }
          .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
          .animate-pulse-button { animation: pulse-button 2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }