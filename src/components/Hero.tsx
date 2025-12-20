import React, { useState } from 'react'; // Убрали useEffect
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';

// Экспортируем интерфейс, чтобы использовать его в Home.tsx
export interface HeroContent {
  title: string;
  subtitle: string;
  image: string;
  mobileImage?: string;
  ctaText: string;
  ctaLink: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
  buttonHoverTextColor?: string;
  buttonHoverBgColor?: string;
}

// Принимаем данные через props
interface HeroProps {
  content: HeroContent | null;
}

export function Hero({ content }: HeroProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Если контента пока нет (хотя Home это предотвратит), ничего не рисуем
  if (!content) return null;

  const buttonStyle = {
    color: isHovered
      ? (content.buttonHoverTextColor || '#000000')
      : (content.buttonTextColor || '#FFFFFF'),
    backgroundColor: isHovered
      ? (content.buttonHoverBgColor || '#FFFFFF')
      : (content.buttonBgColor || 'transparent'),
    borderColor: isHovered
      ? (content.buttonHoverBgColor || '#FFFFFF')
      : (content.buttonTextColor || '#FFFFFF'),
  };

  return (
    <section className="relative w-full min-h-screen flex items-center bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        <picture>
          {content.mobileImage && (
            <source media="(max-width: 768px)" srcSet={content.mobileImage} />
          )}
          <img
            src={content.image}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-70"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-20 lg:py-0">
        <div className="max-w-3xl space-y-8 animate-fade-in-up">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
              <p className="text-xs sm:text-sm tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                ORIENT WATCH
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] text-white whitespace-pre-line shadow-sm">
              {content.title}
            </h1>
          </div>

          <p className="text-base sm:text-lg lg:text-xl font-normal text-white/90 leading-relaxed max-w-xl shadow-sm">
            {content.subtitle}
          </p>

          <div className="pt-4">
            <Link
              to={content.ctaLink}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={buttonStyle}
              className="group inline-flex items-center space-x-4 border-2 px-8 sm:px-10 py-4 text-xs sm:text-sm tracking-[0.2em] font-medium transition-all duration-500 uppercase"
            >
              <span>{content.ctaText}</span>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-2 transition-transform duration-500" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}