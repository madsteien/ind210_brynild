import React from 'react';
import Image from 'next/image';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-red-200">
      <div className="relative h-48 w-full">
        <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-1 rounded-bl-lg z-10 font-bold">
          {product.price.toFixed(2)} kr
        </div>
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-red-600 mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2 group">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-5 h-5 group-hover:rotate-90 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Legg i Handlekurven
        </button>
      </div>
    </div>
  );
}