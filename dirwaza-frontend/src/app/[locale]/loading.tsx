export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-8 bg-primary relative overflow-hidden">
      {/* Animated background dots */}
      <div className="absolute inset-0 opacity-20">
        <div className="animate-bounce absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animation-delay-100"></div>
        <div className="animate-bounce absolute top-1/3 right-1/4 w-1 h-1 bg-white rounded-full animation-delay-300"></div>
        <div className="animate-bounce absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animation-delay-500"></div>
        <div className="animate-bounce absolute bottom-1/3 right-1/3 w-1 h-1 bg-white rounded-full animation-delay-700"></div>
      </div>

      {/* Main loading container */}
      <div className="flex items-center justify-center gap-6 rounded-2xl animate-pulse bg-white/45 p-8 backdrop-blur-sm shadow-2xl transform hover:scale-105 transition-transform duration-300">
        {/* Spinning loader with multiple rings */}
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-gray-900"></div>
          <div className="animate-spin rounded-full h-24 w-24 border-r-4 border-l-4 border-gray-700 absolute top-4 left-4 animation-delay-150"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-500 absolute top-8 left-8 animation-delay-300"></div>
        </div>

        {/* Animated text */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl font-bold text-primary animate-pulse">Loading...</p>
          {/* Animated dots */}
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-100"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce animation-delay-300"></div>
          </div>
        </div>
      </div>

      {/* Bottom animated bar */}
      <div className="w-64 h-1 bg-white/30 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full animate-pulse" style={{
          animation: 'loading-bar 2s ease-in-out infinite'
        }}></div>
      </div>
    </div>
  );
} 