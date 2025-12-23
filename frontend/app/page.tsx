"use client";

import { useState, useRef, useEffect } from 'react';
import { BRANDS_DATA, PART_TYPES } from '@/lib/data';
import { ChevronRight, Settings, Flame } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [viewMode, setViewMode] = useState<'brands' | 'types'>('brands');
  const [selectedBrand, setSelectedBrand] = useState<string | null>(BRANDS_DATA[0].name);
  const modelsRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const currentBrandData = BRANDS_DATA.find(b => b.name === selectedBrand);

  // Scroll to models when brand changes (only if not initial load/top)
  const handleBrandClick = (brandName: string) => {
    setSelectedBrand(brandName);
    // Small timeout to allow state update and DOM render
    setTimeout(() => {
      if (modelsRef.current) {
        const yOffset = -180; // Account for sticky header + toggle bar
        const element = modelsRef.current;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const handleToggle = (mode: 'brands' | 'types') => {
    setViewMode(mode);
    // Scroll to top of the content area
    if (topRef.current) {
       const yOffset = -150; 
       const element = topRef.current;
       const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
       window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans" ref={topRef}>
      {/* Sticky Toggle Section */}
      {/* Top value adjusts based on header height: Mobile ~64px, Desktop ~105px. Added more top spacing for desktop. */}
      <div className="sticky top-[64px] lg:top-[120px] z-40 py-4 bg-transparent transition-all">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-white shadow-sm border border-gray-200 p-1 rounded-full inline-flex relative">
              {/* Sliding Background Pill */}
              <div 
                className={`absolute top-1 bottom-1 rounded-full bg-primary shadow-sm transition-all duration-300 ease-in-out ${
                  viewMode === 'brands' ? 'left-1 w-[calc(50%-4px)]' : 'left-[calc(50%)] w-[calc(50%-4px)]'
                }`}
              />
              
              <button
                onClick={() => handleToggle('brands')}
                className={`relative z-10 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-colors duration-300 ${
                  viewMode === 'brands' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                По маркам и моделям
              </button>
              <button
                onClick={() => handleToggle('types')}
                className={`relative z-10 px-6 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-colors duration-300 ${
                  viewMode === 'types' ? 'text-white' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                По типу запчасти
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16 pt-4">
        
        {/* BRANDS VIEW */}
        {viewMode === 'brands' && (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Brands Sidebar / Grid */}
            <div className="lg:w-1/4">
              <h3 className="text-lg font-bold mb-4 text-gray-900 px-2 hidden lg:block">Бренды</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {BRANDS_DATA.map((brand) => (
                  <button
                    key={brand.name}
                    onClick={() => handleBrandClick(brand.name)}
                    className={`text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group h-16 ${
                      selectedBrand === brand.name
                        ? 'bg-primary text-white shadow-md shadow-orange-200'
                        : 'bg-white text-gray-700 hover:bg-orange-50 hover:text-primary border border-transparent hover:border-orange-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                       {/* Brand Image */}
                       <div className={`relative w-24 h-8 flex-shrink-0`}>
                          <Image 
                            src={`/images/${brand.name}.png`} 
                            alt={brand.name} 
                            fill 
                            className="object-contain object-left"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                       </div>
                       {/* Text fallback (hidden if image loads? No, let's just hide it for now as user requested image) */}
                       {/* Actually, let's keep text for mobile or if image is small? 
                           User said "instead of text". So I will hide the text span.
                       */}
                       <span className={`font-medium truncate ${selectedBrand === brand.name ? 'text-white' : 'text-gray-700'} hidden`}>{brand.name}</span>
                    </div>
                    
                    <ChevronRight className={`w-4 h-4 transition-transform hidden lg:block ${
                      selectedBrand === brand.name ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Models Panel */}
            <div className="lg:w-3/4" ref={modelsRef}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[500px]">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">
                  Модельный ряд {selectedBrand}
                </h2>
                
                {currentBrandData ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {currentBrandData.models.map((model, idx) => (
                      <Link 
                        href={`/catalog?brand=${encodeURIComponent(selectedBrand || '')}&model=${encodeURIComponent(model)}`}
                        key={idx}
                        className="group relative p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="mb-3">
                          <div className="w-10 h-10 rounded-lg bg-orange-100 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <Flame className="w-5 h-5" />
                          </div>
                          <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors text-sm sm:text-base">
                            {model}
                          </h3>
                        </div>
                        <div className="flex items-center text-xs text-gray-400 font-medium group-hover:text-primary/70 mt-2">
                          Смотреть запчасти <ChevronRight className="w-3 h-3 ml-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    Выберите бренд из списка
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TYPES VIEW */}
        {viewMode === 'types' && (
          <div className="animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Категории запчастей</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {PART_TYPES.map((type, idx) => (
                <Link
                  href={`/catalog?type=${encodeURIComponent(type)}`}
                  key={idx}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-primary hover:shadow-lg hover:shadow-orange-100 transition-all duration-300 group text-center h-40"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Settings className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-2 text-sm sm:text-base">
                    {type}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
