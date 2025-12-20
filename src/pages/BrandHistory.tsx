import React, { useEffect, useState } from 'react';
import { publicApi } from '../services/publicApi';
import { SEO } from '../components/SEO';

interface HistoryEvent {
  id: number;
  year: string;
  title: string;
  description: string;
  image: string;
}

// Функция для бесконечного повтора запроса, пока сервер не ответит успешно
async function fetchWithInfiniteRetry<T>(
  fn: () => Promise<T>,
  delay = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(`Ошибка загрузки истории, повтор через ${delay}мс...`, error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithInfiniteRetry(fn, delay);
  }
}

export function BrandHistory() {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchHistory = async () => {
      // Бесконечно пробуем получить данные
      const data = await fetchWithInfiniteRetry(() => publicApi.getHistoryEvents());

      if (isMounted) {
        setEvents(data);
        // Убираем лоадер только после успешной загрузки данных
        setLoading(false);
      }
    };

    fetchHistory();

    return () => { isMounted = false; };
  }, []);

  if (loading) {
    // Полноэкранный лоадер, который висит до победного
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-xs tracking-[0.2em] font-medium text-black uppercase animate-pulse">
          Загрузка истории...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white animate-fade-in">
      <SEO
        title="История бренда Orient Watch – С 1950 года японское мастерство часов | Orient Watch Uzbekistan"
        description="Изучите историю Orient Watch: от основания в 1950 году в Японии - до инноваций в механических часах. Ключевые milestones, традиции качества и глобальный успех. Официальный сайт в Узбекистане. Официальный дилер Orient Watch в Узбекистане."
      />

      {/* Hero */}
      <section className="relative bg-black text-white py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-widest">
            ИСТОРИЯ ORIENT
          </h1>
          <p className="text-xl text-gray-300">
            75 лет японского мастерства и инноваций
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-20">
          {events.map((event, index) => (
            <div key={event.id || index} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-fade-in-up">
              <div className={index % 2 === 0 ? 'order-2 md:order-1' : ''}>
                {index % 2 === 0 ? (
                  <img src={event.image} alt={`Orient ${event.year}`} className="w-full rounded-lg shadow-xl hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="space-y-4">
                    <span className="text-6xl font-bold text-gray-200">{event.year}</span>
                    <h2 className="text-3xl font-bold tracking-wide uppercase">{event.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                )}
              </div>
              <div className={index % 2 === 0 ? 'order-1 md:order-2' : ''}>
                {index % 2 === 0 ? (
                  <div className="space-y-4">
                    <span className="text-6xl font-bold text-gray-200">{event.year}</span>
                    <h2 className="text-3xl font-bold tracking-wide uppercase">{event.title}</h2>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                  </div>
                ) : (
                  <img src={event.image} alt={`Orient ${event.year}`} className="w-full rounded-lg shadow-xl hover:scale-105 transition-transform duration-700" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-widest">НАША ФИЛОСОФИЯ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-4">
              <div className="text-5xl font-bold text-[#C8102E]">100%</div>
              <h3 className="text-xl font-bold tracking-wide">Мануфактура</h3>
              <p className="text-gray-600">Все наши часы оснащены механизмами собственного производства</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-[#C8102E]">75+</div>
              <h3 className="text-xl font-bold tracking-wide">ЛЕТ ОПЫТА</h3>
              <p className="text-gray-600">Более семи десятилетий совершенствования часового мастерства</p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-[#C8102E]">∞</div>
              <h3 className="text-xl font-bold tracking-wide">КАЧЕСТВО</h3>
              <p className="text-gray-600">Каждые часы проходят строгий контроль качества перед отправкой</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}