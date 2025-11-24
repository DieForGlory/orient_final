import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  isNew?: boolean;
}
interface HeroCarouselProps {
  products: Product[];
}
export function HeroCarousel({
  products
}: HeroCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Auto-play functionality
  useEffect(() => {
    if (isHovered || isDragging) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % products.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isHovered, isDragging, products.length]);
  // Smooth scroll to current index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const containerWidth = container.clientWidth;
    const gap = 32;
    const visibleCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    const cardWidth = (containerWidth - gap * (visibleCards - 1)) / visibleCards;
    const targetScroll = (cardWidth + gap) * currentIndex;
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  }, [currentIndex]);
  // Touch/Mouse handlers for swipe
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX - (scrollContainerRef.current?.offsetLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };
  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const x = clientX - (scrollContainerRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };
  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const container = scrollContainerRef.current;
    if (!container) return;
    const containerWidth = container.clientWidth;
    const gap = 32;
    const visibleCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    const cardWidth = (containerWidth - gap * (visibleCards - 1)) / visibleCards;
    const newIndex = Math.round(container.scrollLeft / (cardWidth + gap));
    setCurrentIndex(Math.max(0, Math.min(newIndex, products.length - 1)));
  };
  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => handleStart(e.pageX);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) e.preventDefault();
    handleMove(e.pageX);
  };
  const handleMouseUp = () => handleEnd();
  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const handleTouchEnd = () => handleEnd();
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  const navigate = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setCurrentIndex(prev => (prev + 1) % products.length);
    } else {
      setCurrentIndex(prev => (prev - 1 + products.length) % products.length);
    }
  };
  return <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Navigation Arrows - Hidden on mobile */}
      {!isMobile && <>
          <button onClick={() => navigate('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 backdrop-blur-sm border border-black/10 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white hover:border-black transition-all duration-700 -translate-x-4 group-hover:translate-x-0" aria-label="Предыдущий">
            <ChevronLeftIcon className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button onClick={() => navigate('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/90 backdrop-blur-sm border border-black/10 opacity-0 group-hover:opacity-100 hover:bg-black hover:text-white hover:border-black transition-all duration-700 translate-x-4 group-hover:translate-x-0" aria-label="Следующий">
            <ChevronRightIcon className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </>}

      {/* Carousel Container with Swipe */}
      <div ref={scrollContainerRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} className={`overflow-hidden scroll-smooth ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`} style={{
      userSelect: 'none',
      scrollBehavior: 'smooth',
      WebkitOverflowScrolling: 'touch'
    }}>
        <div className="flex gap-8">
          {products.map((product, index) => <div key={`${product.id}-${index}`} className="flex-none w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.33rem)]">
              <Link to={`/product/${product.id}`} className="group/card block hover-lift" onClick={e => isDragging && e.preventDefault()}>
                {/* Large Card - Reduced padding for bigger image */}
                <div className="relative aspect-square bg-white mb-6 sm:mb-8 overflow-hidden border border-black/5 group-hover/card:border-black/10 transition-all duration-700">
                  {product.isNew && <span className="absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 text-xs tracking-[0.15em] font-semibold z-10 text-[#C8102E] animate-fade-in">
                      NEW
                    </span>}

                  <img src={product.image} alt={product.name} className="w-full h-full object-contain p-6 sm:p-8 lg:p-12 lg:grayscale lg:group-hover/card:grayscale-0 transition-all duration-1000 group-hover/card:scale-105" draggable="false" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/0 group-hover/card:from-black/5 group-hover/card:to-transparent transition-all duration-700"></div>
                </div>

                {/* Product Info */}
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-xs tracking-[0.15em] text-black/50 font-medium transition-colors duration-500 group-hover/card:text-[#C8102E] uppercase">
                    {product.collection}
                  </p>
                  <h3 className="text-base sm:text-lg font-medium tracking-wide group-hover/card:tracking-wider transition-all duration-500 text-black leading-snug">
                    {product.name}
                  </h3>
                  <p className="text-lg sm:text-xl font-semibold tracking-wide transition-all duration-500 group-hover/card:text-[#C8102E] text-black">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </Link>
            </div>)}
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center items-center space-x-3 mt-12 sm:mt-16">
        {products.map((_, index) => <button key={index} onClick={() => goToSlide(index)} className="group/indicator relative" aria-label={`Слайд ${index + 1}`}>
            <div className="w-12 h-px bg-black/20 group-hover/indicator:bg-black/40 transition-colors duration-500"></div>
            <div className={`absolute top-0 left-0 h-px bg-[#C8102E] transition-all duration-1000 ease-out ${currentIndex === index ? 'w-full' : 'w-0'}`}></div>
          </button>)}
      </div>

      {/* Auto-play indicator - Hidden on mobile */}
      {!isMobile && <div className="text-center mt-6">
          <p className="text-xs tracking-[0.2em] text-black/30 font-light transition-opacity duration-500">
            {isHovered ? 'ПАУЗА' : 'АВТОПРОКРУТКА'}
          </p>
        </div>}
    </div>;
}