import React from 'react';
import { CollectionCard } from './CollectionCard';

// Экспортируем интерфейс
export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  watchCount: number;
  number: string;
}

interface CollectionShowcaseProps {
  collections: Collection[];
}

export function CollectionShowcase({ collections }: CollectionShowcaseProps) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="py-10 sm:py-16 lg:py-24 xl:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="mb-8 sm:mb-12 lg:mb-20 xl:mb-24 animate-fade-in">
          <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4 lg:mb-6">
            <div className="w-8 sm:w-10 lg:w-12 xl:w-16 h-0.5 bg-[#C8102E]"></div>
            <p className="text-xs sm:text-sm lg:text-base tracking-[0.15em] sm:tracking-[0.18em] lg:tracking-[0.2em] xl:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
              КОЛЛЕКЦИИ
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight text-black">
            Наследие
          </h2>
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden">
          <div
            className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 sm:pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {collections.map(collection => (
              <div
                key={collection.id}
                className="flex-shrink-0 w-[90vw] sm:w-[85vw] snap-start snap-always"
                style={{ scrollSnapAlign: 'start' }}
              >
                <CollectionCard {...collection} />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {collections.map((_, index) => (
              <div key={index} className="w-2 h-2 rounded-full bg-black/20 transition-all duration-300"></div>
            ))}
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-12">
          {collections[0] && (
            <div className="lg:col-span-2">
              <CollectionCard {...collections[0]} />
            </div>
          )}

          {collections.slice(1).map(collection => (
            <CollectionCard key={collection.id} {...collection} />
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
    </section>
  );
}