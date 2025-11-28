import React, { useEffect, useState } from 'react';
import { SearchIcon, ShoppingBagIcon, MenuIcon, XIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useSettings } from '../contexts/SettingsContext';
import { publicApi } from '../services/publicApi';
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [logo, setLogo] = useState<{
    logoUrl: string;
    logoDarkUrl: string | null;
  } | null>(null);
  const {
    totalItems
  } = useCart();
  const {
    formatPrice
  } = useSettings();
  useEffect(() => {
    loadLogo();
  }, []);
  const loadLogo = async () => {
    try {
      const data = await publicApi.getSiteLogo();
      setLogo(data);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };
  return <>
      {/* Promo Banner */}
      <div className="bg-black text-white text-center py-2 sm:py-3 px-4 overflow-hidden relative">
        <p className="text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.2em] font-medium animate-fade-in">
          СКИДКА 15% НА ВСЕ ЧАСЫ С КОДОМ{' '}
          <span className="text-[#C8102E]">PRE2025</span>
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C8102E] to-transparent opacity-30"></div>
      </div>

      {/* Main Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 hover:text-[#C8102E] transition-colors duration-500" aria-label="Меню">
              {mobileMenuOpen ? <XIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} /> : <MenuIcon className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              {logo?.logoUrl ? <img src={logo.logoUrl} alt="ORIENT" className="h-8 sm:h-10 lg:h-12 object-contain transition-all duration-500 group-hover:opacity-80" /> : <div className="text-lg sm:text-xl lg:text-2xl tracking-[0.15em] sm:tracking-[0.2em] lg:tracking-[0.25em] font-bold transition-all duration-500 group-hover:tracking-[0.2em] sm:group-hover:tracking-[0.25em] lg:group-hover:tracking-[0.3em] group-hover:text-[#C8102E]">
                  ORIENT
                </div>}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 xl:space-x-12">
              <Link to="/catalog" className="nav-link text-sm tracking-[0.15em] font-medium uppercase">
                Каталог
              </Link>
              <Link to="/collections" className="nav-link text-sm tracking-[0.15em] font-medium uppercase">
                Коллекции
              </Link>
              <Link to="/history" className="nav-link text-sm tracking-[0.15em] font-medium uppercase">
                История
              </Link>
              <Link to="/boutique" className="nav-link text-sm tracking-[0.15em] font-medium uppercase">
                Бутик
              </Link>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-6">
              <button onClick={() => setSearchOpen(true)} className="p-2 hover:text-[#C8102E] transition-all duration-500 hover:scale-110" aria-label="Поиск">
                <SearchIcon className="w-5 h-5" strokeWidth={2} />
              </button>
              <Link to="/cart" className="p-2 hover:text-[#C8102E] transition-all duration-500 hover:scale-110 relative group" aria-label="Корзина">
                <ShoppingBagIcon className="w-5 h-5" strokeWidth={2} />
                {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 bg-[#C8102E] text-white text-[9px] sm:text-[10px] w-4 h-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && <>
            <div className="lg:hidden fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={() => setMobileMenuOpen(false)}></div>

            <div className="lg:hidden fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-white z-50 shadow-2xl animate-slide-in-left overflow-y-auto">
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between pb-6 border-b border-black/10">
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    {logo?.logoUrl ? <img src={logo.logoUrl} alt="ORIENT" className="h-8 object-contain" /> : <div className="text-xl tracking-[0.2em] font-bold">
                        ORIENT
                      </div>}
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:text-[#C8102E] transition-colors" aria-label="Закрыть меню">
                    <XIcon className="w-6 h-6" strokeWidth={2} />
                  </button>
                </div>

                <nav className="flex flex-col space-y-6">
                  <Link to="/catalog" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold tracking-wider uppercase hover:text-[#C8102E] transition-colors">
                    Каталог
                  </Link>
                  <Link to="/collections" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold tracking-wider uppercase hover:text-[#C8102E] transition-colors">
                    Коллекции
                  </Link>
                  <Link to="/history" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold tracking-wider uppercase hover:text-[#C8102E] transition-colors">
                    История
                  </Link>
                  <Link to="/boutique" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold tracking-wider uppercase hover:text-[#C8102E] transition-colors">
                    Бутик
                  </Link>
                </nav>

                <div className="pt-6 border-t border-black/10">
                  <button onClick={() => {
                setMobileMenuOpen(false);
                setSearchOpen(true);
              }} className="flex items-center space-x-3 text-base font-medium hover:text-[#C8102E] transition-colors w-full">
                    <SearchIcon className="w-5 h-5" strokeWidth={2} />
                    <span>Поиск</span>
                  </button>
                </div>
              </div>
            </div>
          </>}
      </header>

      {/* Search Modal */}
      {searchOpen && <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-x-0 top-0 bg-white shadow-2xl animate-slide-down">
            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
              <div className="flex items-center gap-4">
                <SearchIcon className="w-6 h-6 text-black/40 flex-shrink-0" strokeWidth={2} />
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск часов Orient..." className="flex-1 text-xl sm:text-2xl font-medium tracking-wide focus:outline-none placeholder:text-black/30" autoFocus />
                <button onClick={() => {
              setSearchOpen(false);
              setSearchQuery('');
            }} className="p-2 hover:bg-gray-100 transition-colors rounded-full" aria-label="Закрыть поиск">
                  <XIcon className="w-6 h-6" strokeWidth={2} />
                </button>
              </div>

              {searchQuery && <div className="mt-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-black/60">Результаты поиска</p>
                    <Link to={`/catalog?search=${searchQuery}`} onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }} className="text-sm text-[#C8102E] hover:underline font-medium">
                      Показать все
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[{
                id: '1',
                name: 'Kamasu Automatic Diver',
                collection: 'SPORTS',
                price: 45900,
                image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=200&q=80'
              }, {
                id: '2',
                name: 'Bambino Classic',
                collection: 'CLASSIC',
                price: 32900,
                image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&q=80'
              }].map(watch => <Link key={watch.id} to={`/product/${watch.id}`} onClick={() => {
                setSearchOpen(false);
                setSearchQuery('');
              }} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors border border-black/10">
                        <img src={watch.image} alt={watch.name} className="w-20 h-20 object-cover bg-gray-50" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs tracking-wider text-black/50 uppercase mb-1">
                            {watch.collection}
                          </p>
                          <h3 className="text-sm font-semibold text-black mb-2 truncate">
                            {watch.name}
                          </h3>
                          <p className="text-lg font-bold text-black">
                            {formatPrice(watch.price)}
                          </p>
                        </div>
                      </Link>)}
                  </div>

                  <div className="pt-6 border-t border-black/10">
                    <p className="text-xs tracking-wider uppercase text-black/50 mb-4">
                      Популярные запросы
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {['Дайверские часы', 'Автоматические', 'Классические', 'Sports', 'Bambino'].map(term => <button key={term} onClick={() => setSearchQuery(term)} className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-sm font-medium transition-colors">
                          {term}
                        </button>)}
                    </div>
                  </div>
                </div>}

              {!searchQuery && <div className="mt-12 text-center space-y-4">
                  <SearchIcon className="w-12 h-12 text-black/20 mx-auto" strokeWidth={1.5} />
                  <p className="text-sm text-black/40">
                    Начните вводить для поиска часов Orient
                  </p>
                </div>}
            </div>
          </div>

          <div className="absolute inset-0 -z-10" onClick={() => {
        setSearchOpen(false);
        setSearchQuery('');
      }}></div>
        </div>}
    </>;
}