import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { SEO } from '../components/SEO';
import { publicApi } from '../services/publicApi';

// Импорт компонентов и интерфейсов
// Убедитесь, что в файлах Hero.tsx, WatchShowcase.tsx и CollectionShowcase.tsx
// вы добавили "export interface ...", как мы делали ранее.
import { Hero, HeroContent } from '../components/Hero';
import { WatchShowcase, FeaturedWatch } from '../components/WatchShowcase';
import { CollectionShowcase, Collection } from '../components/CollectionShowcase';

interface HeritageContent {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  yearsText: string;
}

// === НОВАЯ ФУНКЦИЯ ===
// Бесконечный повтор запроса, пока сервер не ответит успешно (200 OK).
// Никаких заглушек. Только ожидание.
async function fetchWithInfiniteRetry<T>(
  fn: () => Promise<T>,
  delay = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(`Сервер занят или недоступен, повтор через ${delay}мс...`, error);
    // Ждем указанное время (2 секунды)
    await new Promise(resolve => setTimeout(resolve, delay));
    // Рекурсивно пробуем снова
    return fetchWithInfiniteRetry(fn, delay);
  }
}

export function Home() {
  const [loading, setLoading] = useState(true);

  // Стейт для данных
  const [data, setData] = useState<{
    hero: HeroContent | null;
    watches: FeaturedWatch[];
    collections: Collection[];
    heritage: HeritageContent | null;
  }>({
    hero: null,
    watches: [],
    collections: [],
    heritage: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      try {
        // Запускаем 4 параллельных потока с бесконечным ретраем.
        // Promise.all завершится ТОЛЬКО когда ВСЕ 4 запроса вернут успех.
        const [heroData, watchesData, collectionsData, heritageData] = await Promise.all([
          fetchWithInfiniteRetry(() => publicApi.getHeroContent()),
          fetchWithInfiniteRetry(() => publicApi.getFeaturedWatches()),
          fetchWithInfiniteRetry(() => publicApi.getCollections().then(res => res.slice(0, 3))),
          fetchWithInfiniteRetry(() => publicApi.getHeritageSection())
        ]);

        if (isMounted) {
          setData({
            hero: heroData,
            watches: watchesData,
            collections: collectionsData,
            heritage: heritageData
          });
          // Убираем лоадер только когда у нас есть НАСТОЯЩИЕ данные
          setLoading(false);
        }
      } catch (error) {
        // Сюда код теоретически никогда не попадет из-за бесконечного цикла retry,
        // но оставим лог на всякий случай.
        console.error('Unexpected error:', error);
      }
    };

    fetchAllData();

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    // Полноэкранный лоадер
    // Он будет висеть, пока бэкенд не "проснется" и не отдаст данные
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
         <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs tracking-[0.2em] font-medium text-black uppercase animate-pulse">
              Загрузка...
            </div>
         </div>
      </div>
    );
  }

  // Рендерим страницу только когда все данные точно загружены
  return (
    <div className="w-full bg-white animate-fade-in">
      <SEO
        title="Orient Watch Uzbekistan. Купить часы Orient в Ташкенте. Официальный дилер Orient Watch в Узбекистане."
        description="Оригинальные японские часы Orient в Узбекистане: коллекции, новинки, гарантия и бесплатная доставка по Ташкенту. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
      />

      {/* Теперь мы уверены, что data.hero существует */}
      {data.hero && <Hero content={data.hero} />}

      <WatchShowcase products={data.watches} />
      <CollectionShowcase collections={data.collections} />

      {data.heritage && (
        <section className="bg-black text-white py-16 sm:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="line-draw absolute top-1/3 left-0 right-0"></div>
            <div className="line-draw absolute top-2/3 left-0 right-0" style={{ animationDelay: '1.5s' }}></div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-16 text-center space-y-8 sm:space-y-12 relative z-10">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-center space-x-3 sm:space-x-4">
                <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
                <p className="text-xs tracking-[0.25em] text-[#C8102E] font-medium animate-fade-in uppercase">
                  {data.heritage.subtitle}
                </p>
                <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
              </div>
              <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight animate-fade-in-up whitespace-pre-line">
                {data.heritage.title}
              </h2>
            </div>
            <p className="text-base sm:text-lg lg:text-xl font-normal text-white/80 leading-relaxed max-w-xl mx-auto animate-slide-in-right">
              {data.heritage.description}
            </p>
            <Link to={data.heritage.ctaLink} className="group inline-flex items-center space-x-3 sm:space-x-4 border-2 border-white px-8 sm:px-12 py-4 sm:py-5 text-xs sm:text-sm tracking-[0.2em] font-medium hover:bg-white hover:text-black hover:border-[#C8102E] transition-all duration-700 animate-fade-in uppercase">
              <span>{data.heritage.ctaText}</span>
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-2 transition-transform duration-500" strokeWidth={2} />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}