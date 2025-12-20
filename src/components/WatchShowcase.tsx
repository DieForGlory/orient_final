import React from 'react';
import { HeroCarousel } from './HeroCarousel';

// Экспортируем интерфейс
export interface FeaturedWatch {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  isNew?: boolean;
}

interface WatchShowcaseProps {
  products: FeaturedWatch[];
}

export function WatchShowcase({ products }: WatchShowcaseProps) {
  // Если товаров нет, секция просто не отрисуется
  if (!products || products.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="mb-12 sm:mb-16 lg:mb-24 animate-fade-in">
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 mb-4 sm:mb-6">
            <div className="w-8 sm:w-12 lg:w-16 h-0.5 bg-[#C8102E]"></div>
            <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
              ИЗБРАННОЕ
            </p>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-black">
            Новинки
          </h2>
        </div>

        <HeroCarousel products={products} />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    </section>
  );
}