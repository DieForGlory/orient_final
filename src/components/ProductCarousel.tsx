import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ProductCard } from './ProductCard';
interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  isNew?: boolean;
}
interface ProductCarouselProps {
  products: Product[];
}
export function ProductCarousel({
  products
}: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const updateScrollState = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
    // Update current index based on scroll position
    const card = container.querySelector('div[data-card]') as HTMLElement;
    if (card) {
      const cardWidth = card.offsetWidth;
      const gap = 32;
      const index = Math.round(scrollLeft / (cardWidth + gap));
      setCurrentIndex(Math.max(0, Math.min(products.length - 1, index)));
    }
  };
  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [products.length]);
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const card = container.querySelector('div[data-card]') as HTMLElement;
    if (!card) return;
    const cardWidth = card.offsetWidth;
    const gap = 32;
    const targetScroll = index * (cardWidth + gap);
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };
  const scroll = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left' ? Math.max(0, currentIndex - 1) : Math.min(products.length - 1, currentIndex + 1);
    scrollToIndex(newIndex);
  };
  return <div className="relative">
      {/* Navigation Buttons - Hidden on mobile */}
      <div className="hidden sm:flex items-center justify-end space-x-4 mb-12">
        <button onClick={() => scroll('left')} disabled={!canScrollLeft} className={`p-4 border-2 border-black transition-all duration-500 ${canScrollLeft ? 'hover:bg-black hover:text-white cursor-pointer' : 'opacity-20 cursor-not-allowed'}`} aria-label="Предыдущий">
          <ChevronLeftIcon className="w-6 h-6" strokeWidth={2} />
        </button>
        <button onClick={() => scroll('right')} disabled={!canScrollRight} className={`p-4 border-2 border-black transition-all duration-500 ${canScrollRight ? 'hover:bg-black hover:text-white cursor-pointer' : 'opacity-20 cursor-not-allowed'}`} aria-label="Следующий">
          <ChevronRightIcon className="w-6 h-6" strokeWidth={2} />
        </button>
      </div>

      {/* Carousel Container - Pure CSS Snap Scroll */}
      <div ref={scrollContainerRef} onScroll={updateScrollState} className="flex gap-8 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:mx-0 sm:px-0" style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      WebkitOverflowScrolling: 'touch',
      scrollSnapType: 'x mandatory',
      scrollPaddingLeft: '1rem',
      scrollPaddingRight: '1rem'
    }}>
        {products.map((product, index) => <div key={product.id} data-card className="flex-none w-[85vw] sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)]" style={{
        scrollSnapAlign: 'center',
        scrollSnapStop: 'always'
      }}>
            <ProductCard {...product} index={index} />
          </div>)}
      </div>

      {/* Scroll Indicators */}
      <div className="flex justify-center space-x-2 mt-8 sm:mt-12">
        {products.map((_, index) => <button key={index} onClick={() => scrollToIndex(index)} className={`h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-8 bg-[#C8102E]' : 'w-2 bg-black/30'}`} aria-label={`Перейти к слайду ${index + 1}`} />)}
      </div>
    </div>;
}