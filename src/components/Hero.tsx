import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { publicApi } from '../services/publicApi';
interface HeroContent {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}
export function Hero() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<HeroContent | null>(null);
  useEffect(() => {
    fetchHeroContent();
  }, []);
  const fetchHeroContent = async () => {
    try {
      const data = await publicApi.getHeroContent();
      setContent(data);
    } catch (error) {
      console.error('Error fetching hero content:', error);
      // Fallback content
      setContent({
        title: 'НАЙДИТЕ\nИДЕАЛЬНЫЕ\nЧАСЫ.',
        subtitle: 'Японское мастерство и точность в каждой детали',
        image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
        ctaText: 'Смотреть коллекцию',
        ctaLink: '/catalog'
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <section className="relative bg-black text-white min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </section>;
  }
  if (!content) return null;
  return <section className="relative bg-black text-white min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="absolute top-2/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-20 w-full relative z-10 py-12 sm:py-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 sm:gap-12 lg:gap-20 xl:gap-32 items-center">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in-up max-w-2xl">
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-8 sm:w-12 lg:w-16 h-0.5 bg-[#C8102E]"></div>
                <p className="text-[9px] sm:text-[10px] lg:text-xs tracking-[0.15em] sm:tracking-[0.2em] lg:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                  ORIENT WATCH
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold tracking-tight leading-[1.05] whitespace-pre-line">
                {content.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-normal text-white/80 leading-relaxed max-w-md">
              {content.subtitle}
            </p>
            <Link to={content.ctaLink} className="group inline-flex items-center space-x-2 sm:space-x-3 border-2 border-white px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-3 lg:py-4 xl:py-5 text-[10px] sm:text-xs lg:text-sm tracking-[0.15em] sm:tracking-[0.2em] font-medium hover:bg-white hover:text-black hover:border-[#C8102E] transition-all duration-700 uppercase">
              <span>{content.ctaText}</span>
              <ArrowRightIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 transform group-hover:translate-x-2 transition-transform duration-500" strokeWidth={2} />
            </Link>
          </div>

          <div className="relative animate-fade-in flex justify-center lg:justify-end">
            <div className="relative aspect-square w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] lg:max-w-[450px] xl:max-w-[550px] 2xl:max-w-[600px]">
              <div className="absolute inset-0 border-2 border-white/10 rounded-sm"></div>
              <div className="absolute inset-3 sm:inset-4 lg:inset-6 xl:inset-8 border border-white/5 rounded-sm"></div>

              <div className="relative z-10 flex items-center justify-center h-full p-6 sm:p-8 lg:p-10 xl:p-12 2xl:p-16">
                <img src={content.image} alt="Orient Watch" className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all duration-1000 hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}