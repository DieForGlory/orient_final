import React, { useEffect, useState } from 'react';
import { SaveIcon, PlusIcon, TrashIcon, GripVerticalIcon } from 'lucide-react';
import { api } from '../../services/api';
import { ImageUpload } from '../../components/admin/ImageUpload';
interface SiteLogo {
  logoUrl: string;
  logoDarkUrl: string | null;
}
interface HeroContent {
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}
interface PromoBanner {
  text: string;
  code: string;
  active: boolean;
  backgroundColor: string;
  textColor: string;
  highlightColor: string;
}
interface FeaturedWatch {
  id: string;
  productId: string;
  order: number;
  isNew: boolean;
}
interface HeritageSection {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  yearsText: string;
}
export function AdminContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Site Logo
  const [siteLogo, setSiteLogo] = useState<SiteLogo>({
    logoUrl: 'https://via.placeholder.com/150x50?text=ORIENT',
    logoDarkUrl: null
  });
  // Hero Section
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: 'НАЙДИТЕ\nИДЕАЛЬНЫЕ\nЧАСЫ.',
    subtitle: 'Японское мастерство и точность в каждой детали',
    image: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80',
    ctaText: 'Смотреть коллекцию',
    ctaLink: '/catalog'
  });
  // Promo Banner
  const [promoBanner, setPromoBanner] = useState<PromoBanner>({
    text: 'СКИДКА 15% НА ВСЕ ЧАСЫ С КОДОМ',
    code: 'PRE2025',
    active: true,
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    highlightColor: '#C8102E'
  });
  // Featured Watches (для карусели)
  const [featuredWatches, setFeaturedWatches] = useState<FeaturedWatch[]>([{
    id: '1',
    productId: '1',
    order: 1,
    isNew: true
  }, {
    id: '2',
    productId: '2',
    order: 2,
    isNew: false
  }, {
    id: '3',
    productId: '3',
    order: 3,
    isNew: false
  }, {
    id: '4',
    productId: '4',
    order: 4,
    isNew: true
  }, {
    id: '5',
    productId: '5',
    order: 5,
    isNew: false
  }, {
    id: '6',
    productId: '6',
    order: 6,
    isNew: false
  }]);
  // Heritage Section
  const [heritageSection, setHeritageSection] = useState<HeritageSection>({
    title: '75 лет\nмастерства',
    subtitle: 'С 1950 года',
    description: 'Orient создает механические часы высочайшего качества, объединяя традиционное японское мастерство с современными технологиями.',
    ctaText: 'Узнать историю',
    ctaLink: '/history',
    yearsText: '75'
  });
  useEffect(() => {
    fetchContent();
  }, []);
  const fetchContent = async () => {
    setLoading(true);
    try {
      const [logoData, heroData, promoData, featuredData, heritageData] = await Promise.all([api.getSiteLogo(), api.getHeroContent(), api.getPromoBanner(), api.getFeaturedWatches(), api.getHeritageSection()]);
      setSiteLogo(logoData);
      setHeroContent(heroData);
      setPromoBanner(promoData);
      setFeaturedWatches(featuredData);
      setHeritageSection(heritageData);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveLogo = async () => {
    setSaving(true);
    try {
      await api.updateSiteLogo(siteLogo);
      alert('Логотип обновлен!');
    } catch (error) {
      console.error('Error saving logo:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };
  const handleSaveHero = async () => {
    setSaving(true);
    try {
      await api.updateHeroContent(heroContent);
      alert('Hero секция обновлена!');
    } catch (error) {
      console.error('Error saving hero:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };
  const handleSavePromo = async () => {
    setSaving(true);
    try {
      await api.updatePromoBanner(promoBanner);
      alert('Промо баннер обновлен!');
    } catch (error) {
      console.error('Error saving promo:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };
  const handleSaveFeatured = async () => {
    setSaving(true);
    try {
      // Extract only product IDs for backend
      const productIds = featuredWatches.filter(w => w.productId) // Only include watches with productId
      .map(w => w.productId);
      await api.updateFeaturedWatches(productIds);
      alert('Избранные часы обновлены!');
    } catch (error) {
      console.error('Error saving featured:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };
  const handleSaveHeritage = async () => {
    setSaving(true);
    try {
      await api.updateHeritageSection(heritageSection);
      alert('Секция Heritage обновлена!');
    } catch (error) {
      console.error('Error saving heritage:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };
  const addFeaturedWatch = () => {
    const newWatch: FeaturedWatch = {
      id: `temp-${Date.now()}`,
      productId: '',
      order: featuredWatches.length + 1,
      isNew: false
    };
    setFeaturedWatches([...featuredWatches, newWatch]);
  };
  const removeFeaturedWatch = (id: string) => {
    setFeaturedWatches(featuredWatches.filter(w => w.id !== id));
  };
  const updateFeaturedWatch = (id: string, updates: Partial<FeaturedWatch>) => {
    setFeaturedWatches(featuredWatches.map(w => w.id === id ? {
      ...w,
      ...updates
    } : w));
  };
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </div>;
  }
  return <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Контент главной страницы
        </h1>
        <p className="text-black/60">
          Управление всем контентом на главной странице
        </p>
      </div>

      {/* Site Logo */}
      <div className="bg-white p-8 border-2 border-black/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              Логотип сайта
            </h2>
            <p className="text-sm text-black/60 mt-1">
              Логотип отображается в шапке сайта
            </p>
          </div>
          <button onClick={handleSaveLogo} disabled={saving} className="flex items-center space-x-2 bg-[#C8102E] hover:bg-[#A00D24] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-50">
            <SaveIcon className="w-4 h-4" strokeWidth={2} />
            <span>Сохранить</span>
          </button>
        </div>

        <div className="space-y-6">
          <ImageUpload value={siteLogo.logoUrl} onChange={url => setSiteLogo({
          ...siteLogo,
          logoUrl: url
        })} label="Логотип (светлый фон)" required />

          <ImageUpload value={siteLogo.logoDarkUrl || ''} onChange={url => setSiteLogo({
          ...siteLogo,
          logoDarkUrl: url || null
        })} label="Логотип (темный фон)" required={false} />

          <div className="bg-gray-50 p-4 border-2 border-gray-200">
            <p className="text-sm text-black/60 mb-3">
              <strong>Предпросмотр:</strong>
            </p>
            <div className="flex items-center space-x-8">
              <div className="bg-white p-4 border-2 border-black/10">
                <img src={siteLogo.logoUrl} alt="Logo Light" className="h-12 object-contain" />
                <p className="text-xs text-center mt-2 text-black/50">
                  Светлый фон
                </p>
              </div>
              {siteLogo.logoDarkUrl && <div className="bg-black p-4">
                  <img src={siteLogo.logoDarkUrl} alt="Logo Dark" className="h-12 object-contain" />
                  <p className="text-xs text-center mt-2 text-white/50">
                    Темный фон
                  </p>
                </div>}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white p-8 border-2 border-black/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              Hero Секция
            </h2>
            <p className="text-sm text-black/60 mt-1">
              Главный баннер в верхней части страницы
            </p>
          </div>
          <button onClick={handleSaveHero} disabled={saving} className="flex items-center space-x-2 bg-[#C8102E] hover:bg-[#A00D24] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-50">
            <SaveIcon className="w-4 h-4" strokeWidth={2} />
            <span>Сохранить</span>
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium tracking-wider uppercase mb-3">
              Заголовок <span className="text-[#C8102E]">*</span>
            </label>
            <textarea value={heroContent.title} onChange={e => setHeroContent({
            ...heroContent,
            title: e.target.value
          })} rows={3} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none resize-none font-bold text-2xl" placeholder="НАЙДИТЕ\nИДЕАЛЬНЫЕ\nЧАСЫ." />
            <p className="text-xs text-black/50 mt-2">
              Используйте \n для переноса строки
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium tracking-wider uppercase mb-3">
              Подзаголовок <span className="text-[#C8102E]">*</span>
            </label>
            <input type="text" value={heroContent.subtitle} onChange={e => setHeroContent({
            ...heroContent,
            subtitle: e.target.value
          })} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none" placeholder="Японское мастерство и точность в каждой детали" />
          </div>

          <ImageUpload value={heroContent.image} onChange={url => setHeroContent({
          ...heroContent,
          image: url
        })} label="Изображение часов" required />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Текст кнопки <span className="text-[#C8102E]">*</span>
              </label>
              <input type="text" value={heroContent.ctaText} onChange={e => setHeroContent({
              ...heroContent,
              ctaText: e.target.value
            })} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none" placeholder="Смотреть коллекцию" />
            </div>

            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Ссылка кнопки <span className="text-[#C8102E]">*</span>
              </label>
              <input type="text" value={heroContent.ctaLink} onChange={e => setHeroContent({
              ...heroContent,
              ctaLink: e.target.value
            })} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none" placeholder="/catalog" />
            </div>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="bg-white p-8 border-2 border-black/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              Промо Баннер
            </h2>
            <p className="text-sm text-black/60 mt-1">
              Баннер с акцией в самом верху сайта
            </p>
          </div>
          <button onClick={handleSavePromo} disabled={saving} className="flex items-center space-x-2 bg-[#C8102E] hover:bg-[#A00D24] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-50">
            <SaveIcon className="w-4 h-4" strokeWidth={2} />
            <span>Сохранить</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Текст баннера <span className="text-[#C8102E]">*</span>
              </label>
              <input type="text" value={promoBanner.text} onChange={e => setPromoBanner({
              ...promoBanner,
              text: e.target.value
            })} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none" placeholder="СКИДКА 15% НА ВСЕ ЧАСЫ С КОДОМ" />
            </div>

            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Промокод <span className="text-[#C8102E]">*</span>
              </label>
              <input type="text" value={promoBanner.code} onChange={e => setPromoBanner({
              ...promoBanner,
              code: e.target.value
            })} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none font-bold" placeholder="PRE2025" />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input type="checkbox" checked={promoBanner.active} onChange={e => setPromoBanner({
              ...promoBanner,
              active: e.target.checked
            })} className="w-5 h-5" />
              <span className="text-sm font-medium tracking-wider uppercase">
                Показывать баннер
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Цвет фона
              </label>
              <input type="color" value={promoBanner.backgroundColor} onChange={e => setPromoBanner({
              ...promoBanner,
              backgroundColor: e.target.value
            })} className="w-full h-12 border-2 border-black/20 cursor-pointer" />
            </div>

            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Цвет текста
              </label>
              <input type="color" value={promoBanner.textColor} onChange={e => setPromoBanner({
              ...promoBanner,
              textColor: e.target.value
            })} className="w-full h-12 border-2 border-black/20 cursor-pointer" />
            </div>

            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Цвет промокода
              </label>
              <input type="color" value={promoBanner.highlightColor} onChange={e => setPromoBanner({
              ...promoBanner,
              highlightColor: e.target.value
            })} className="w-full h-12 border-2 border-black/20 cursor-pointer" />
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium tracking-wider uppercase mb-3">
              Предпросмотр
            </label>
            <div className="p-4 text-center text-sm font-medium tracking-wider" style={{
            backgroundColor: promoBanner.backgroundColor,
            color: promoBanner.textColor
          }}>
              {promoBanner.text}{' '}
              <span style={{
              color: promoBanner.highlightColor
            }}>
                {promoBanner.code}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Watches Carousel */}
      <div className="bg-white p-8 border-2 border-black/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              Избранные часы
            </h2>
            <p className="text-sm text-black/60 mt-1">
              Карусель с избранными моделями (секция "Коллекция")
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button onClick={addFeaturedWatch} className="flex items-center space-x-2 border-2 border-black hover:bg-black hover:text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all">
              <PlusIcon className="w-4 h-4" strokeWidth={2} />
              <span>Добавить</span>
            </button>
            <button onClick={handleSaveFeatured} disabled={saving} className="flex items-center space-x-2 bg-[#C8102E] hover:bg-[#A00D24] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-50">
              <SaveIcon className="w-4 h-4" strokeWidth={2} />
              <span>Сохранить</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {featuredWatches.map((watch, index) => <div key={watch.id} className="flex items-center gap-4 p-4 border-2 border-black/10">
              <GripVerticalIcon className="w-5 h-5 text-black/40 cursor-move" strokeWidth={2} />

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase mb-2">
                    ID товара <span className="text-[#C8102E]">*</span>
                  </label>
                  <input type="text" value={watch.productId} onChange={e => updateFeaturedWatch(watch.id, {
                productId: e.target.value
              })} className="w-full px-3 py-2 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none text-sm" placeholder="1" />
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase mb-2">
                    Порядок
                  </label>
                  <input type="number" value={watch.order} onChange={e => updateFeaturedWatch(watch.id, {
                order: parseInt(e.target.value)
              })} className="w-full px-3 py-2 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none text-sm" />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={watch.isNew} onChange={e => updateFeaturedWatch(watch.id, {
                  isNew: e.target.checked
                })} className="w-4 h-4" />
                    <span className="text-xs font-medium tracking-wider uppercase">
                      Показать "NEW"
                    </span>
                  </label>
                </div>
              </div>

              <button onClick={() => removeFeaturedWatch(watch.id)} className="p-2 text-black/40 hover:text-[#C8102E] hover:bg-red-50 transition-all">
                <TrashIcon className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>)}
        </div>

        <p className="text-xs text-black/50 mt-4">
          * Введите ID товара из базы данных. Товары будут отображаться в
          порядке, указанном в поле "Порядок".
        </p>
      </div>

      {/* Heritage Section */}
      <div className="bg-white p-8 border-2 border-black/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              Секция Heritage
            </h2>
            <p className="text-sm text-black/60 mt-1">
              Баннер с историей бренда (черный фон)
            </p>
          </div>
          <button onClick={handleSaveHeritage} disabled={saving} className="flex items-center space-x-2 bg-[#C8102E] hover:bg-[#A00D24] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-50">
            <SaveIcon className="w-4 h-4" strokeWidth={2} />
            <span>Сохранить</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Количество лет <span className="text-[#C8102E]">*</span>
              </label>
              <input type="text" value={heritageSection.yearsText} onChange={e => setHeritageSection({
              ...heritageSection,
              yearsText: e.target.value
            })} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none font-bold text-2xl" placeholder="75" />
            </div>

            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Подзаголовок <span className="text-[#C8102E]">*</span>
              </label>
              <input type="text" value={heritageSection.subtitle} onChange={e => setHeritageSection({
              ...heritageSection,
              subtitle: e.target.value
            })} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none" placeholder="С 1950 года" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium tracking-wider uppercase mb-3">
              Заголовок <span className="text-[#C8102E]">*</span>
            </label>
            <textarea value={heritageSection.title} onChange={e => setHeritageSection({
            ...heritageSection,
            title: e.target.value
          })} rows={2} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none resize-none font-bold text-xl" placeholder="75 лет\nмастерства" />
            <p className="text-xs text-black/50 mt-2">
              Используйте \n для переноса строки
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium tracking-wider uppercase mb-3">
              Описание <span className="text-[#C8102E]">*</span>
            </label>
            <textarea value={heritageSection.description} onChange={e => setHeritageSection({
            ...heritageSection,
            description: e.target.value
          })} rows={3} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none resize-none" placeholder="Orient создает механические часы высочайшего качества..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Текст кнопки <span className="text-[#C8102E]">*</span>
              </label>
              <input type="text" value={heritageSection.ctaText} onChange={e => setHeritageSection({
              ...heritageSection,
              ctaText: e.target.value
            })} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none" placeholder="Узнать историю" />
            </div>

            <div>
              <label className="block text-sm font-medium tracking-wider uppercase mb-3">
                Ссылка кнопки <span className="text-[#C8102E]">*</span>
              </label>
              <input type="text" value={heritageSection.ctaLink} onChange={e => setHeritageSection({
              ...heritageSection,
              ctaLink: e.target.value
            })} className="w-full px-4 py-3 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none" placeholder="/history" />
            </div>
          </div>
        </div>
      </div>
    </div>;
}