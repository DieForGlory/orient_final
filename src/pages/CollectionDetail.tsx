// src/pages/CollectionDetail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProductCarousel } from '../components/ProductCarousel';
import { ArrowRightIcon } from 'lucide-react';
import { publicApi } from '../services/publicApi';
import { SEO } from '../components/SEO';

interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  watchCount: number;
}

interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  isNew?: boolean;
}

// SEO Config по файлу seo_orientwatch.uz.xlsx
const collectionSEO: Record<string, { title: string; description: string }> = {
  sports: {
    title: "Коллекция Sports Orient Watch – Спортивные часы для активного образа | Orient Watch Uzbekistan",
    description: "Спортивные часы Orient Sports: водозащита до 200м, автоматические механизмы. Модели для дайвинга, бега и повседневки. Купить с доставкой по Узбекистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
  },
  classic: {
    title: "Коллекция Classic Orient – Элегантные механические часы | Orient Watch Uzbekistan",
    description: "Классические часы Orient Classic: timeless дизайн, автоматический подзавод, сапфировое стекло. Модели для выхода, встреч и важных мероприятий. Купить с доставкой по Узбекистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
  },
  contemporary: {
    title: "Коллекция Contemporary Orient – Современные стильные часы | Orient Watch Uzbekistan",
    description: "Современные часы Orient Contemporary: минималистичный дизайн, многофункциональные циферблаты, кварц и автомат. Купить с доставкой по Узбекистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
  },
  revival: {
    title: "Коллекция Revival Orient – Ретро-часы с винтажным шармом | Orient Watch Uzbekistan",
    description: "Ретро-часы Orient Revival : винтажный дизайн, механика и кварц, аутентичные дизайны. Купить с доставкой по Узбекистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
  },
  bambino: {
    title: "Коллекция Bambino Orient – Классика с открытым балансом | Orient Watch Uzbekistan",
    description: "Bambino Orient: автоматические часы с open heart, выпуклым стеклом и римскими цифрами. Купить с доставкой по Узбекистану. Гарантия 2 года. Официальный дилер Orient Watch в Узбекистане."
  }
};

// Функция для бесконечного повтора запроса при ошибке
async function fetchWithInfiniteRetry<T>(
  fn: () => Promise<T>,
  delay = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(`Ошибка загрузки коллекции, повтор через ${delay}мс...`, error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithInfiniteRetry(fn, delay);
  }
}

export function CollectionDetail() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;

    if (id) {
      const loadData = async () => {
        // Запускаем параллельную загрузку данных коллекции и товаров
        // Promise.all завершится только когда ОБА запроса пройдут успешно (благодаря fetchWithInfiniteRetry)
        const [collectionData, productsData] = await Promise.all([
          fetchWithInfiniteRetry(() => publicApi.getCollection(id)),
          fetchWithInfiniteRetry(() => publicApi.getCollectionProducts(id, { limit: 50 }))
        ]);

        if (isMounted) {
          setCollection(collectionData);
          setProducts(productsData.data);
          // Выключаем лоадер только когда все данные готовы
          setLoading(false);
        }
      };

      loadData();
    }

    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-xs tracking-[0.2em] font-medium text-black uppercase animate-pulse">
           Загрузка коллекции...
        </div>
      </div>
    );
  }

  if (!collection) {
    // Этот экран покажется только если API вернет null (например, если такой коллекции не существует в БД),
    // но не при ошибках сети (при них будет вечная загрузка).
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">КОЛЛЕКЦИЯ НЕ НАЙДЕНА</h1>
          <Link to="/collections" className="inline-block text-[#C8102E] hover:underline">Вернуться к коллекциям</Link>
        </div>
      </div>
    );
  }

  // Получаем SEO из конфига или генерируем дефолтный
  const seoData = (id && collectionSEO[id.toLowerCase()]) || {
    title: `${collection.name} | Orient Watch Uzbekistan`,
    description: collection.description
  };

  return (
    <div className="w-full bg-white">
      <SEO title={seoData.title} description={seoData.description} />

      <section className="relative bg-black text-white min-h-[80vh] flex items-center">
        <div className="absolute inset-0">
          <img src={collection.image} alt={collection.name} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-8 lg:px-16 w-full py-20">
          <div className="max-w-3xl space-y-10">
            <div className="flex items-center space-x-3 text-sm text-white/60">
              <Link to="/" className="hover:text-white transition-colors">Главная</Link>
              <span>/</span>
              <Link to="/collections" className="hover:text-white transition-colors">Коллекции</Link>
              <span>/</span>
              <span className="text-white">{collection.name}</span>
            </div>
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-0.5 bg-[#C8102E]"></div>
                <p className="text-xs tracking-[0.25em] text-[#C8102E] font-medium uppercase">Коллекция</p>
              </div>
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight leading-none">{collection.name}</h1>
            </div>
            <p className="text-xl font-normal text-white/90 leading-relaxed drop-shadow-sm">{collection.description}</p>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-0.5 bg-[#C8102E]"></div>
              <span className="text-sm tracking-[0.2em] text-white/80 font-medium">{collection.watchCount} МОДЕЛЕЙ</span>
            </div>
            <Link to={`/catalog?collection=${collection.name}`} className="inline-flex items-center space-x-3 border-2 border-white px-10 py-4 text-sm tracking-[0.2em] font-medium hover:bg-white hover:text-black transition-all duration-500 uppercase">
              <span>Смотреть все модели</span>
              <ArrowRightIcon className="w-5 h-5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="py-32 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8 lg:px-16">
            <div className="mb-16">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-0.5 bg-[#C8102E]"></div>
                <p className="text-xs tracking-[0.25em] text-[#C8102E] font-medium uppercase">{products.length} избранных моделей</p>
              </div>
              <div className="flex items-end justify-between">
                <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Модели коллекции</h2>
                <Link to={`/catalog?collection=${collection.name}`} className="hidden md:inline-flex items-center space-x-3 text-sm tracking-[0.15em] font-medium hover:text-[#C8102E] transition-colors duration-500 uppercase">
                  <span>Все модели</span>
                  <ArrowRightIcon className="w-5 h-5" strokeWidth={2} />
                </Link>
              </div>
            </div>
            <ProductCarousel products={products} />
          </div>
        </section>
      )}

      <section className="bg-black text-white py-32">
        <div className="max-w-4xl mx-auto px-8 lg:px-16 text-center space-y-10">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">Примерьте в бутике</h2>
          <p className="text-xl font-normal text-white/70 max-w-2xl mx-auto">Запишитесь на персональную консультацию и оцените качество наших часов вживую</p>
          <Link to="/boutique" className="inline-flex items-center space-x-4 bg-[#C8102E] hover:bg-[#A00D24] text-white px-12 py-5 text-sm tracking-[0.2em] font-medium transition-all duration-500 uppercase">
            <span>Записаться на визит</span>
            <ArrowRightIcon className="w-5 h-5" strokeWidth={2} />
          </Link>
        </div>
      </section>
    </div>
  );
}