import React from 'react';
import { Link } from 'react-router-dom';
import { RotateCcwIcon, CheckCircleIcon, XCircleIcon, AlertCircleIcon } from 'lucide-react';
export function ReturnPolicy() {
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
            <span className="text-white">ВОЗВРАТ</span>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 sm:w-16 h-0.5 bg-[#C8102E]"></div>
              <p className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] text-[#C8102E] font-medium uppercase">
                УСЛОВИЯ ВОЗВРАТА
              </p>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none">
              ВОЗВРАТ
              <br />И ОБМЕН
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-16 py-12 sm:py-16 lg:py-24">
        {/* Return Period */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Сроки возврата и обмена
          </h2>

          <div className="bg-[#C8102E] text-white p-6 sm:p-8 mb-8">
            <div className="flex items-start space-x-4">
              <RotateCcwIcon className="w-8 h-8 flex-shrink-0 mt-1" strokeWidth={1.5} />
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 uppercase">
                  14 дней на возврат
                </h3>
                <p className="text-white/90 leading-relaxed">
                  Вы можете вернуть или обменять товар надлежащего качества в
                  течение 14 дней с момента получения, если он не подошел по
                  размеру, цвету или комплектации.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border-2 border-black/10">
              <div className="text-4xl font-bold text-[#C8102E] mb-2">14</div>
              <p className="text-sm uppercase tracking-wider font-medium">
                Дней на возврат
              </p>
            </div>
            <div className="text-center p-6 border-2 border-black/10">
              <div className="text-4xl font-bold text-[#C8102E] mb-2">100%</div>
              <p className="text-sm uppercase tracking-wider font-medium">
                Возврат средств
              </p>
            </div>
            <div className="text-center p-6 border-2 border-black/10">
              <div className="text-4xl font-bold text-[#C8102E] mb-2">0₽</div>
              <p className="text-sm uppercase tracking-wider font-medium">
                Без комиссии
              </p>
            </div>
          </div>
        </section>

        {/* Return Conditions */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Условия возврата
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-6 border-2 border-green-500/20 bg-green-50">
              <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" strokeWidth={2} />
              <div>
                <h3 className="font-bold mb-2 uppercase tracking-wide">
                  Товар принимается к возврату, если:
                </h3>
                <ul className="space-y-2 text-black/70">
                  <li>• Сохранен товарный вид и потребительские свойства</li>
                  <li>• Сохранена оригинальная упаковка</li>
                  <li>• Сохранены все ярлыки и пломбы</li>
                  <li>
                    • Есть документ, подтверждающий покупку (чек, накладная)
                  </li>
                  <li>• Товар не был в эксплуатации</li>
                  <li>• Нет следов механических повреждений</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-6 border-2 border-red-500/20 bg-red-50">
              <XCircleIcon className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" strokeWidth={2} />
              <div>
                <h3 className="font-bold mb-2 uppercase tracking-wide">
                  Товар НЕ принимается к возврату, если:
                </h3>
                <ul className="space-y-2 text-black/70">
                  <li>• Нарушена целостность упаковки</li>
                  <li>• Товар был в эксплуатации</li>
                  <li>• Есть следы механических повреждений</li>
                  <li>• Отсутствуют комплектующие или документы</li>
                  <li>• Прошло более 14 дней с момента покупки</li>
                  <li>• Товар изготовлен по индивидуальному заказу</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Return Process */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Как оформить возврат
          </h2>

          <div className="space-y-6">
            <div className="flex items-start space-x-6 p-6 border-2 border-black/10">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                  Свяжитесь с нами
                </h3>
                <p className="text-black/70 leading-relaxed">
                  Позвоните по телефону +998 71 123 45 67 или напишите на email
                  info@orient.uz. Сообщите номер заказа и причину возврата.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 border-2 border-black/10">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                  Подготовьте товар
                </h3>
                <p className="text-black/70 leading-relaxed">
                  Упакуйте товар в оригинальную упаковку со всеми
                  комплектующими, документами и чеком. Убедитесь, что товар не
                  имеет следов использования.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 border-2 border-black/10">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                  Передайте товар
                </h3>
                <p className="text-black/70 leading-relaxed">
                  Привезите товар в наш бутик или передайте курьеру. Мы проверим
                  товар на соответствие условиям возврата.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-6 p-6 border-2 border-black/10">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0 font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2 uppercase tracking-wide">
                  Получите деньги
                </h3>
                <p className="text-black/70 leading-relaxed">
                  После проверки товара мы вернем деньги в течение 3-5 рабочих
                  дней тем же способом, которым была произведена оплата.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exchange */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Обмен товара
          </h2>

          <div className="bg-gray-50 border-2 border-black/10 p-6 sm:p-8">
            <p className="text-black/70 leading-relaxed mb-6">
              Вы можете обменять товар на аналогичный другого размера, цвета или
              модели. Обмен производится при наличии товара на складе.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <AlertCircleIcon className="w-5 h-5 text-[#C8102E] flex-shrink-0 mt-1" strokeWidth={2} />
                <p className="text-black/70 leading-relaxed">
                  Если стоимость нового товара выше, необходимо доплатить
                  разницу
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircleIcon className="w-5 h-5 text-[#C8102E] flex-shrink-0 mt-1" strokeWidth={2} />
                <p className="text-black/70 leading-relaxed">
                  Если стоимость нового товара ниже, мы вернем разницу
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircleIcon className="w-5 h-5 text-[#C8102E] flex-shrink-0 mt-1" strokeWidth={2} />
                <p className="text-black/70 leading-relaxed">
                  Обмен производится бесплатно в течение 14 дней
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Defective Products */}
        <section className="mb-16 sm:mb-24">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8 sm:mb-12 uppercase">
            Возврат товара с браком
          </h2>

          <div className="border-l-4 border-[#C8102E] pl-6 sm:pl-8 mb-6">
            <p className="text-black/70 leading-relaxed">
              Если вы обнаружили производственный брак или дефект, вы можете
              вернуть товар в течение гарантийного срока (2 года для часов
              Orient).
            </p>
          </div>

          <div className="space-y-4 text-black/70">
            <p className="leading-relaxed">
              <strong className="text-black">Производственный брак:</strong>{' '}
              Возврат денег или обмен на новый товар в течение 14 дней. После 14
              дней - гарантийный ремонт.
            </p>
            <p className="leading-relaxed">
              <strong className="text-black">Механические повреждения:</strong>{' '}
              Не являются гарантийным случаем. Ремонт за счет покупателя.
            </p>
            <p className="leading-relaxed">
              <strong className="text-black">Попадание влаги:</strong>{' '}
              Гарантийный случай только при соблюдении условий
              водонепроницаемости.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-16 sm:mt-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6 uppercase">
            Нужна помощь с возвратом?
          </h2>
          <p className="text-black/70 mb-8 max-w-2xl mx-auto leading-relaxed">
            Наши специалисты помогут вам оформить возврат или обмен товара.
            Свяжитесь с нами любым удобным способом.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+998711234567" className="px-8 py-4 bg-[#C8102E] hover:bg-[#A00D24] text-white text-sm font-semibold uppercase tracking-wider transition-all">
              Позвонить нам
            </a>
            <a href="mailto:info@orient.uz" className="px-8 py-4 border-2 border-black hover:bg-black hover:text-white text-sm font-semibold uppercase tracking-wider transition-all">
              Написать Email
            </a>
          </div>
        </section>
      </div>
    </div>;
}