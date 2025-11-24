import React from 'react';
export function BrandHistory() {
  return <div className="w-full bg-white">
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
          {/* 1950 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src="https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80" alt="Orient 1950" className="w-full rounded-lg shadow-xl" />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <span className="text-6xl font-bold text-gray-200">1950</span>
              <h2 className="text-3xl font-bold tracking-wide">ОСНОВАНИЕ</h2>
              <p className="text-gray-700 leading-relaxed">
                Orient Watch Company была основана в Токио с миссией создавать
                доступные, но качественные механические часы для японского
                рынка. С самого начала компания фокусировалась на собственном
                производстве механизмов.
              </p>
            </div>
          </div>

          {/* 1970 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-6xl font-bold text-gray-200">1970</span>
              <h2 className="text-3xl font-bold tracking-wide">
                ТЕХНОЛОГИЧЕСКИЙ ПРОРЫВ
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Запуск собственного автоматического механизма Orient 46 серии,
                который стал основой для многих будущих моделей. Этот механизм
                отличался надежностью и точностью хода.
              </p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80" alt="Orient 1970" className="w-full rounded-lg shadow-xl" />
            </div>
          </div>

          {/* 1990 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80" alt="Orient 1990" className="w-full rounded-lg shadow-xl" />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <span className="text-6xl font-bold text-gray-200">1990</span>
              <h2 className="text-3xl font-bold tracking-wide">
                МИРОВОЕ ПРИЗНАНИЕ
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Orient выходит на международный рынок и получает признание за
                качество своих механических часов. Запуск культовой коллекции
                Bambino, которая становится символом доступной элегантности.
              </p>
            </div>
          </div>

          {/* 2009 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-6xl font-bold text-gray-200">2009</span>
              <h2 className="text-3xl font-bold tracking-wide">НОВАЯ ЭРА</h2>
              <p className="text-gray-700 leading-relaxed">
                Orient присоединяется к Seiko Epson Corporation, получая доступ
                к передовым технологиям, сохраняя при этом свою уникальную
                идентичность и независимость в дизайне.
              </p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800&q=80" alt="Orient 2009" className="w-full rounded-lg shadow-xl" />
            </div>
          </div>

          {/* 2025 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800&q=80" alt="Orient 2025" className="w-full rounded-lg shadow-xl" />
            </div>
            <div className="order-1 md:order-2 space-y-4">
              <span className="text-6xl font-bold text-gray-200">2025</span>
              <h2 className="text-3xl font-bold tracking-wide">
                СОВРЕМЕННОСТЬ
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Сегодня Orient продолжает традиции японского часового
                мастерства, создавая механические часы высочайшего качества.
                Каждая модель сочетает проверенные временем технологии с
                современным дизайном.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-bold tracking-widest">НАША ФИЛОСОФИЯ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-4">
              <div className="text-5xl font-bold text-[#C8102E]">100%</div>
              <h3 className="text-xl font-bold tracking-wide">МЕХАНИЧЕСКИЕ</h3>
              <p className="text-gray-600">
                Все наши часы оснащены механическими механизмами собственного
                производства
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-[#C8102E]">75+</div>
              <h3 className="text-xl font-bold tracking-wide">ЛЕТ ОПЫТА</h3>
              <p className="text-gray-600">
                Более семи десятилетий совершенствования часового мастерства
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-5xl font-bold text-[#C8102E]">∞</div>
              <h3 className="text-xl font-bold tracking-wide">КАЧЕСТВО</h3>
              <p className="text-gray-600">
                Каждые часы проходят строгий контроль качества перед отправкой
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>;
}