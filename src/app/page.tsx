import React from 'react';
import Navbar from '../components/Navbar';
import ProductGrid from '../components/ProductGrid';
import Footer from '../components/Footer';
import ImageCarousel from '../components/ImageCarousel';
import { products } from '../data/products';
import { carouselItems } from '../data/carouselItems';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-red-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16 relative overflow-hidden">
          {/* Decorative candy elements */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-20 rounded-full"></div>
          <div className="absolute top-5 right-10 w-20 h-20 bg-white opacity-20 rounded-full"></div>
          <div className="absolute bottom-5 left-1/4 w-16 h-16 bg-white opacity-20 rounded-full"></div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-white text-red-600 px-3 py-1 rounded-lg transform inline-block -rotate-2 mb-2">Brynild</span>
              <span className="inline-block ml-2">Godteributikk</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8">Handle for en rimligere pris direkte fra oss!</p>
            <button className="bg-white hover:bg-red-100 text-red-600 font-bold py-3 px-8 rounded-full transition-transform duration-300 text-lg hover:scale-105 transform -rotate-1">
              Kjøp nå!
            </button>
          </div>
        </section>
        
        {/* Featured Categories with animated carousel */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8 text-red-600">Våre favoritter</h2>
            <ImageCarousel items={carouselItems} />
          </div>
        </section>
        
        {/* Products Section */}
        <ProductGrid products={products} />
      </main>
      
      <Footer />
    </div>
  );
}
