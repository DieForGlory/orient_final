import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, ClockIcon, FileTextIcon } from 'lucide-react';
export function Warranty() {
  return <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
          <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center space-x-2 sm:space-x-3 text-[10px] sm:text-xs tracking-[0.15em] text-white/50 font-medium mb-8 sm:mb-12">
            <Link to="/" className="hover:text-white transition-colors">
              ГЛАВНАЯ
            </Link>
            <span>/</span>
            <span className="text-white">ГАРАНТИЯ</span>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                ГАРАНТИЙНОЕ ОБСЛУЖИВАНИЕ
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
              ГАРАНТИЯ
              <br />
              КАЧЕСТВА
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24">
        {/* Warranty Period */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Гарантийный срок
          </h2>

          <div className="bg-[#C8102E] text-white p-6 sm:p-8 mb-8">
            <div className="flex items-start space-x-4">
              <ShieldCheckIcon className="w-8 h-8 flex-shrink-0 mt-1" strokeWidth={1.5} />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 uppercase">
                  2 года гарантии
                </h3>
                <p className="text-white/90 leading-relaxed">
                  На все часы Orient предоставляется официальная гарантия
                  производителя сроком на 2 года с момента покупки. Гарантия
                  распространяется на производственные дефекты механизма и
                  корпуса.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="border-2 border-black/10 p-6 sm:p-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
                <ClockIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 uppercase tracking-wide">
                Механизм
              </h3>
              <p className="text-black/70 leading-relaxed mb-4">
                Гарантия на механизм часов действует 2 года и покрывает все
                производственные дефекты автоматического или механического
                калибра.
              </p>
              <p className="text-sm font-semibold">Срок: 2 года</p>
            </div>

            <div className="border-2 border-black/10 p-6 sm:p-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
                <ShieldCheckIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 uppercase tracking-wide">
                Корпус и браслет
              </h3>
              <p className="text-black/70 leading-relaxed mb-4">
                Гарантия на корпус, стекло и браслет покрывает производственные
                дефекты материалов и качества сборки.
              </p>
              <p className="text-sm font-semibold">Срок: 2 года</p>
            </div>
          </div>
        </section>

        {/* Warranty Coverage */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Что покрывает гарантия
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-6 sm:pl-8 bg-green-50 py-4">
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide text-green-900">
                Гарантийные случаи
              </h3>
              <ul className="space-y-2 text-black/70">
                <li>• Остановка механизма без видимых причин</li>
                <li>• Неточность хода, превышающая допустимые нормы</li>
                <li>
                  • Дефекты корпуса или стекла, возникшие при производстве
                </li>
                <li>• Отслоение покрытия корпуса или браслета</li>
                <li>• Неисправность автоподзавода</li>
                <li>• Дефекты циферблата или стрелок</li>
                <li>
                  • Проблемы с водонепроницаемостью при соблюдении условий
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 pl-6 sm:pl-8 bg-red-50 py-4">
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide text-red-900">
                Негарантийные случаи
              </h3>
              <ul className="space-y-2 text-black/70">
                <li>• Механические повреждения (удары, падения, царапины)</li>
                <li>• Попадание влаги при нарушении условий эксплуатации</li>
                <li>• Самостоятельный ремонт или вскрытие корпуса</li>
                <li>• Ремонт в неавторизованных сервисных центрах</li>
                <li>• Естественный износ браслета, стекла или покрытия</li>
                <li>• Повреждения от химических веществ</li>
                <li>• Утеря или кража часов</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Warranty Service */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Гарантийное обслуживание
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-6 p-6 border-2 border-black/10">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                  Обратитесь к нам
                </h3>
                <p className="text-black/70 leading-relaxed">
                  Свяжитесь с нами по телефону +998 71 123 45 67 или приезжайте
                  в наш бутик. Опишите проблему и предоставьте гарантийный
                  талон.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 border-2 border-black/10">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                  Диагностика
                </h3>
                <p className="text-black/70 leading-relaxed">
                  Наши специалисты проведут диагностику часов и определят,
                  является ли случай гарантийным. Диагностика бесплатна.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 border-2 border-black/10">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                  Ремонт
                </h3>
                <p className="text-black/70 leading-relaxed">
                  При гарантийном случае ремонт производится бесплатно в течение
                  14-30 рабочих дней. Вы получите акт о выполненных работах.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 border-2 border-black/10">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                  Получение
                </h3>
                <p className="text-black/70 leading-relaxed">
                  После завершения ремонта мы свяжемся с вами. Вы можете забрать
                  часы в бутике или заказать доставку.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Required Documents */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Необходимые документы
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-2 border-black/10 p-6">
              <FileTextIcon className="w-8 h-8 text-[#C8102E] mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">
                Гарантийный талон
              </h3>
              <p className="text-black/70 leading-relaxed">
                Оригинал гарантийного талона с печатью магазина и датой продажи.
                Без талона гарантия не действует.
              </p>
            </div>

            <div className="border-2 border-black/10 p-6">
              <FileTextIcon className="w-8 h-8 text-[#C8102E] mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">
                Чек или накладная
              </h3>
              <p className="text-black/70 leading-relaxed">
                Документ, подтверждающий покупку. Может быть кассовый чек,
                товарная накладная или счет-фактура.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-gray-50 border-2 border-black/10 p-6 sm:p-8">
            <h3 className="font-bold mb-4 uppercase tracking-wide">Важно:</h3>
            <ul className="space-y-3 text-black/70">
              <li className="flex items-start space-x-3">
                <span className="text-[#C8102E] font-bold mt-1">•</span>
                <span className="leading-relaxed">
                  Сохраняйте гарантийный талон и чек в течение всего
                  гарантийного срока
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#C8102E] font-bold mt-1">•</span>
                <span className="leading-relaxed">
                  Не допускайте вскрытия корпуса неавторизованными лицами
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-[#C8102E] font-bold mt-1">•</span>
                <span className="leading-relaxed">
                  При утере гарантийного талона обратитесь к нам для
                  восстановления
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Service Center */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Сервисный центр
          </h2>

          <div className="border-2 border-black/10 p-6 sm:p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-8 h-8 text-[#C8102E] flex-shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">
                  Авторизованный сервис Orient
                </h3>
                <p className="text-black/70 leading-relaxed">
                  Наш сервисный центр является официальным партнером Orient. Все
                  мастера прошли обучение и сертификацию производителя.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div>
                <h4 className="font-bold mb-3 uppercase tracking-wide text-sm">
                  Услуги сервиса:
                </h4>
                <ul className="space-y-2 text-sm text-black/70">
                  <li>• Гарантийный ремонт</li>
                  <li>• Послегарантийное обслуживание</li>
                  <li>• Чистка и смазка механизма</li>
                  <li>• Замена батареек (кварцевые модели)</li>
                  <li>• Регулировка точности хода</li>
                  <li>• Полировка корпуса и браслета</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold mb-3 uppercase tracking-wide text-sm">
                  График работы:
                </h4>
                <ul className="space-y-2 text-sm text-black/70">
                  <li>• Пн-Пт: 10:00 - 19:00</li>
                  <li>• Сб: 10:00 - 16:00</li>
                  <li>• Вс: выходной</li>
                  <li className="pt-2">
                    <strong className="text-black">Адрес:</strong> Ташкент, ул.
                    Амира Темура
                  </li>
                  <li>
                    <strong className="text-black">Телефон:</strong> +998 71 123
                    45 67
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-16 sm:mt-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 uppercase">
            Вопросы по гарантии?
          </h2>
          <p className="text-black/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Наши специалисты ответят на все ваши вопросы о гарантийном
            обслуживании часов Orient.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+998711234567" className="px-8 py-4 bg-[#C8102E] hover:bg-[#A00D24] text-white text-sm font-semibold uppercase tracking-wider transition-all">
              Позвонить нам
            </a>
            <Link to="/boutique" className="px-8 py-4 border-2 border-black hover:bg-black hover:text-white text-sm font-semibold uppercase tracking-wider transition-all">
              Посетить сервис
            </Link>
          </div>
        </section>
      </div>
    </div>;
}