'use client';

import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import ImageGalleryModal from '@/components/rest/ImageGalleryModal';

interface RestPageClientProps {
  images: string[];
  restTitle: string;
  imageCount: number;
  imageText: string;
}

export default function RestPageClient({ 
  images, 
  restTitle, 
  imageCount, 
  imageText 
}: RestPageClientProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const openGallery = () => {
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  return (
    <>
      <button
        onClick={openGallery}
        className="bg-white px-3 py-1 rounded-full hover:bg-gray-50 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-1">
          <ImageIcon className="w-4 h-4" />
          <span className="text-sm">
            {imageCount} {imageText}
          </span>
        </span>
      </button>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={closeGallery}
        images={images}
        restTitle={restTitle}
        initialIndex={0}
      />
    </>
  );
} 