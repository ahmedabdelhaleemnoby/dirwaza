'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

interface ProfileTestToggleProps {
  className?: string;
}

export default function ProfileTestToggle({ className = '' }: ProfileTestToggleProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className={`fixed top-4 left-4 z-50 bg-white p-4 rounded-lg shadow-lg border ${className}`}>
      <div className="text-sm text-gray-600 mb-2">Test Mode</div>
      <Button
        variant={isAuthenticated ? "outline" : "primary"}
        size="sm"
        onClick={() => setIsAuthenticated(!isAuthenticated)}
      >
        {isAuthenticated ? "Logout (Test)" : "Login (Test)"}
      </Button>
      {isAuthenticated && (
        <div className="mt-2">
          <Button variant="ghost" size="sm" href="/profile">
            Go to Profile
          </Button>
        </div>
      )}
    </div>
  );
} 