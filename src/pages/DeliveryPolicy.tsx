import React from 'react';
import { Link } from 'react-router-dom';
import { TruckIcon, ClockIcon, MapPinIcon, PackageIcon } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export function DeliveryPolicy() {
  // Получаем shipping и formatPrice из контекста
  const { site, shipping, formatPrice } = useSettings();

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-16 sm:py-24">
        {/* ... (код Hero секции без изменений) ... */}
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
            <span className="text-white">ДОСТАВКА</span>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                УСЛОВИЯ ДОСТАВКИ
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
              ДОСТАВКА
              <br />И ОПЛАТА
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24">
        {/* Delivery Methods */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Способы доставки
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="border-2 border-black/10 p-6 sm:p-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
                <TruckIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 uppercase tracking-wide">
                Курьерская доставка
              </h3>
              <p className="text-black/70 mb-4 leading-relaxed">
                Доставка по Ташкенту в течение 1-2 рабочих дней. Курьер свяжется
                с вами для согласования времени доставки.
              </p>
              <p className="text-sm font-semibold">Стоимость: {formatPrice(shipping.standardCost)}</p>
              <p className="text-xs text-black/60 mt-2">
                Бесплатно при заказе от {formatPrice(shipping.freeShippingThreshold)}
              </p>
            </div>

            <div className="border-2 border-black/10 p-6 sm:p-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
                <PackageIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 uppercase tracking-wide">
                Экспресс-доставка
              </h3>
              <p className="text-black/70 mb-4 leading-relaxed">
                Срочная доставка в день заказа. Доступна при оформлении заказа
                до 14:00.
              </p>
              <p className="text-sm font-semibold">Стоимость: {formatPrice(shipping.expressCost)}</p>
              <p className="text-xs text-black/60 mt-2">Только по Ташкенту</p>
            </div>

            <div className="border-2 border-black/10 p-6 sm:p-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
                <MapPinIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 uppercase tracking-wide">
                Самовывоз
              </h3>
              <p className="text-black/70 mb-4 leading-relaxed">
                Забрать заказ можно в нашем бутике в центре Ташкента ({site.address}). Товар
                будет готов к выдаче в течение 2 часов.
              </p>
              <p className="text-sm font-semibold">Бесплатно</p>
              <p className="text-xs text-black/60 mt-2">
                Ежедневно с 10:00 до 20:00
              </p>
            </div>

            <div className="border-2 border-black/10 p-6 sm:p-8">
              <div className="w-12 h-12 bg-black flex items-center justify-center mb-6">
                <ClockIcon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-4 uppercase tracking-wide">
                Доставка по регионам
              </h3>
              <p className="text-black/70 mb-4 leading-relaxed">
                Доставка в регионы Узбекистана через транспортные компании. Срок
                доставки 3-5 рабочих дней.
              </p>
              {/* Примечание: В базе данных нет отдельного поля для регионов,
                  поэтому здесь оставляем хардкод или привязываемся к стандарту + наценка */}
              <p className="text-sm font-semibold">От 80 000 сум</p>
              <p className="text-xs text-black/60 mt-2">Зависит от региона</p>
            </div>
          </div>
        </section>

        {/* Остальные секции (Оплата, Инфо, Контакты) оставляем без изменений */}
        {/* Payment Methods */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Способы оплаты
          </h2>
          <div className="space-y-6">
             <div className="border-l-4 border-[#C8102E] pl-6 sm:pl-8">
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">
                Наличными курьеру
              </h3>
              <p className="text-black/70 leading-relaxed">
                Оплата наличными при получении заказа. Курьер предоставит чек и
                гарантийный талон.
              </p>
            </div>
            {/* ... другие способы оплаты ... */}
             <div className="border-l-4 border-[#C8102E] pl-6 sm:pl-8">
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">
                Банковской картой
              </h3>
              <p className="text-black/70 leading-relaxed">
                Оплата картой Visa, Mastercard, UzCard или Humo. Безопасная
                оплата через защищенное соединение.
              </p>
            </div>
             <div className="border-l-4 border-[#C8102E] pl-6 sm:pl-8">
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">
                Банковский перевод
              </h3>
              <p className="text-black/70 leading-relaxed">
                Оплата по реквизитам компании. После оплаты пришлите чек на наш
                email для подтверждения.
              </p>
            </div>
             <div className="border-l-4 border-[#C8102E] pl-6 sm:pl-8">
              <h3 className="text-lg font-bold mb-3 uppercase tracking-wide">
                Рассрочка
              </h3>
              <p className="text-black/70 leading-relaxed">
                Оформление рассрочки на 3, 6 или 12 месяцев через партнерские
                банки. Без первоначального взноса и переплаты.
              </p>
            </div>
          </div>
        </section>

        {/* Important Info */}
        <section className="bg-gray-50 border-2 border-black/10 p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6 uppercase">
            Важная информация
          </h2>
          <ul className="space-y-4 text-black/70">
            <li className="flex items-start space-x-3">
              <span className="text-[#C8102E] font-bold mt-1">•</span>
              <span className="leading-relaxed">
                Все часы проходят проверку качества перед отправкой
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-[#C8102E] font-bold mt-1">•</span>
              <span className="leading-relaxed">
                При получении вы можете осмотреть товар в присутствии курьера
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-[#C8102E] font-bold mt-1">•</span>
              <span className="leading-relaxed">
                Доставка осуществляется только после подтверждения заказа
                менеджером
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-[#C8102E] font-bold mt-1">•</span>
              <span className="leading-relaxed">
                Сохраняйте упаковку и документы для возможного возврата
              </span>
            </li>
          </ul>
        </section>

        {/* Contact */}
        <section className="mt-16 sm:mt-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 uppercase">
            Остались вопросы?
          </h2>
          <p className="text-black/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Свяжитесь с нами любым удобным способом, и мы с радостью ответим на
            все ваши вопросы о доставке и оплате.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href={`tel:${site.phone.replace(/\s+/g, '')}`} className="px-8 py-4 bg-[#C8102E] hover:bg-[#A00D24] text-white text-sm font-semibold uppercase tracking-wider transition-all">
              Позвонить нам
            </a>
            <Link to="/boutique" className="px-8 py-4 border-2 border-black hover:bg-black hover:text-white text-sm font-semibold uppercase tracking-wider transition-all">
              Посетить бутик
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}