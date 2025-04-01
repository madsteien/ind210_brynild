import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative mb-10">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600 relative z-10">
          Våre produkter
        </h2>
        <div className="absolute inset-x-0 -bottom-3 h-2 bg-red-100 transform"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={`transform ${index % 3 === 0 ? 'rotate-1' : index % 3 === 1 ? '-rotate-1' : 'rotate-0'}`}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}