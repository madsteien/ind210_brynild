import React from 'react';
import Image from 'next/image';

interface CarouselItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface ImageCarouselProps {
  items: CarouselItem[];
}

export default function ImageCarousel({ items }: ImageCarouselProps) {
  // Duplicate items to create a seamless loop effect
  const duplicatedItems = [...items, ...items];
  
  return (
    <div className="w-full overflow-hidden relative">
      <div className="animate-scroll flex">
        {duplicatedItems.map((item, index) => (
          <div 
            key={`${item.id}-${index}`} 
            className="min-w-[200px] h-[160px] bg-red-100 mx-4 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform relative group"
          >
            <div className="relative w-full h-full">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 200px, 200px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-600 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
              <p className="font-bold text-white bg-red-600 bg-opacity-80 rounded py-1">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}