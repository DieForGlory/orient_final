import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '../services/publicApi';
export function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [collections, setCollections] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>(null);
  const [priceMin, setPriceMin] = useState(searchParams.get('minPrice') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('maxPrice') || '');
  const [openSections, setOpenSections] = useState<string[]>(['КОЛЛЕКЦИЯ', 'ЦЕНА']);
  useEffect(() => {
    loadCollections();
    loadFilters();
  }, []);
  const loadCollections = async () => {
    try {
      const data = await publicApi.getCollections();
      setCollections(data);
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };
  const loadFilters = async () => {
    try {
      const data = await publicApi.getFilters();
      setFilters(data);
    } catch (error) {
      console.error('Error loading filters:', error);
    }
  };
  const toggleSection = (title: string) => {
    setOpenSections(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };
  const handleCollectionChange = (value: string, checked: boolean) => {
    if (checked) {
      searchParams.set('collection', value);
    } else {
      searchParams.delete('collection');
    }
    searchParams.delete('page');
    setSearchParams(searchParams);
  };
  const handleFilterChange = (key: string, value: string, checked: boolean) => {
    if (checked) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    searchParams.delete('page');
    setSearchParams(searchParams);
  };
  const clearFilters = () => {
    setSearchParams({});
    setPriceMin('');
    setPriceMax('');
  };
  const selectedCollection = searchParams.get('collection') || '';
  return <aside className="w-full lg:w-80 bg-white">
      <div className="pb-6 border-b border-black/10">
        <h2 className="text-xl font-bold tracking-tight uppercase">Фильтры</h2>
      </div>

      <div className="divide-y divide-black/10">
        {/* Collections */}
        <div className="py-6">
          <button onClick={() => toggleSection('КОЛЛЕКЦИЯ')} className="flex items-center justify-between w-full mb-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Коллекция
            </h3>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${openSections.includes('КОЛЛЕКЦИЯ') ? 'rotate-180' : ''}`} strokeWidth={2} />
          </button>

          {openSections.includes('КОЛЛЕКЦИЯ') && <div className="space-y-3">
              {collections.map(collection => <label key={collection.id} className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={selectedCollection === collection.name} onChange={e => handleCollectionChange(collection.name, e.target.checked)} className="w-4 h-4 border-2 border-black/20 text-[#C8102E] focus:ring-[#C8102E] focus:ring-offset-0 cursor-pointer" />
                  <span className="text-sm text-black/70 group-hover:text-black flex-1 font-medium">
                    {collection.name}
                  </span>
                  {collection.watchCount > 0 && <span className="text-xs text-black/40">
                      ({collection.watchCount})
                    </span>}
                </label>)}
            </div>}
        </div>

        {/* Movement */}
        {filters?.movements && filters.movements.length > 0 && <div className="py-6">
            <button onClick={() => toggleSection('МЕХАНИЗМ')} className="flex items-center justify-between w-full mb-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Механизм
              </h3>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${openSections.includes('МЕХАНИЗМ') ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>

            {openSections.includes('МЕХАНИЗМ') && <div className="space-y-3">
                {filters.movements.map((option: any) => <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={searchParams.get('movement') === option.value} onChange={e => handleFilterChange('movement', option.value, e.target.checked)} className="w-4 h-4 border-2 border-black/20 text-[#C8102E] focus:ring-[#C8102E] focus:ring-offset-0 cursor-pointer" />
                    <span className="text-sm text-black/70 group-hover:text-black flex-1 font-medium">
                      {option.label}
                    </span>
                    {option.count > 0 && <span className="text-xs text-black/40">
                        ({option.count})
                      </span>}
                  </label>)}
              </div>}
          </div>}

        {/* Case Material */}
        {filters?.caseMaterials && filters.caseMaterials.length > 0 && <div className="py-6">
            <button onClick={() => toggleSection('МАТЕРИАЛ КОРПУСА')} className="flex items-center justify-between w-full mb-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Материал корпуса
              </h3>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${openSections.includes('МАТЕРИАЛ КОРПУСА') ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>

            {openSections.includes('МАТЕРИАЛ КОРПУСА') && <div className="space-y-3">
                {filters.caseMaterials.map((option: any) => <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={searchParams.get('caseMaterial') === option.value} onChange={e => handleFilterChange('caseMaterial', option.value, e.target.checked)} className="w-4 h-4 border-2 border-black/20 text-[#C8102E] focus:ring-[#C8102E] focus:ring-offset-0 cursor-pointer" />
                    <span className="text-sm text-black/70 group-hover:text-black flex-1 font-medium">
                      {option.label}
                    </span>
                    {option.count > 0 && <span className="text-xs text-black/40">
                        ({option.count})
                      </span>}
                  </label>)}
              </div>}
          </div>}

        {/* Dial Color */}
        {filters?.dialColors && filters.dialColors.length > 0 && <div className="py-6">
            <button onClick={() => toggleSection('ЦВЕТ ЦИФЕРБЛАТА')} className="flex items-center justify-between w-full mb-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Цвет циферблата
              </h3>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${openSections.includes('ЦВЕТ ЦИФЕРБЛАТА') ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>

            {openSections.includes('ЦВЕТ ЦИФЕРБЛАТА') && <div className="space-y-3">
                {filters.dialColors.map((option: any) => <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={searchParams.get('dialColor') === option.value} onChange={e => handleFilterChange('dialColor', option.value, e.target.checked)} className="w-4 h-4 border-2 border-black/20 text-[#C8102E] focus:ring-[#C8102E] focus:ring-offset-0 cursor-pointer" />
                    <span className="text-sm text-black/70 group-hover:text-black flex-1 font-medium">
                      {option.label}
                    </span>
                    {option.count > 0 && <span className="text-xs text-black/40">
                        ({option.count})
                      </span>}
                  </label>)}
              </div>}
          </div>}

        {/* Water Resistance */}
        {filters?.waterResistance && filters.waterResistance.length > 0 && <div className="py-6">
            <button onClick={() => toggleSection('ВОДОНЕПРОНИЦАЕМОСТЬ')} className="flex items-center justify-between w-full mb-4">
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Водонепроницаемость
              </h3>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${openSections.includes('ВОДОНЕПРОНИЦАЕМОСТЬ') ? 'rotate-180' : ''}`} strokeWidth={2} />
            </button>

            {openSections.includes('ВОДОНЕПРОНИЦАЕМОСТЬ') && <div className="space-y-3">
                {filters.waterResistance.map((option: any) => <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={searchParams.get('waterResistance') === option.value} onChange={e => handleFilterChange('waterResistance', option.value, e.target.checked)} className="w-4 h-4 border-2 border-black/20 text-[#C8102E] focus:ring-[#C8102E] focus:ring-offset-0 cursor-pointer" />
                    <span className="text-sm text-black/70 group-hover:text-black flex-1 font-medium">
                      {option.label}
                    </span>
                    {option.count > 0 && <span className="text-xs text-black/40">
                        ({option.count})
                      </span>}
                  </label>)}
              </div>}
          </div>}

        {/* Price Range */}
        <div className="py-6">
          <button onClick={() => toggleSection('ЦЕНА')} className="flex items-center justify-between w-full mb-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase">
              Цена
            </h3>
            <ChevronDownIcon className={`w-4 h-4 transition-transform ${openSections.includes('ЦЕНА') ? 'rotate-180' : ''}`} strokeWidth={2} />
          </button>

          {openSections.includes('ЦЕНА') && <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input type="number" placeholder="От" value={priceMin} onChange={e => {
              setPriceMin(e.target.value);
              const timer = setTimeout(() => {
                if (e.target.value) {
                  searchParams.set('minPrice', e.target.value);
                } else {
                  searchParams.delete('minPrice');
                }
                searchParams.delete('page');
                setSearchParams(searchParams);
              }, 500);
              return () => clearTimeout(timer);
            }} className="w-full px-3 py-2 border-2 border-black/20 text-sm focus:outline-none focus:border-[#C8102E]" />
                <span className="text-black/40">—</span>
                <input type="number" placeholder="До" value={priceMax} onChange={e => {
              setPriceMax(e.target.value);
              const timer = setTimeout(() => {
                if (e.target.value) {
                  searchParams.set('maxPrice', e.target.value);
                } else {
                  searchParams.delete('maxPrice');
                }
                searchParams.delete('page');
                setSearchParams(searchParams);
              }, 500);
              return () => clearTimeout(timer);
            }} className="w-full px-3 py-2 border-2 border-black/20 text-sm focus:outline-none focus:border-[#C8102E]" />
              </div>
            </div>}
        </div>
      </div>

      {/* Reset */}
      <div className="pt-6">
        <button onClick={clearFilters} className="text-sm text-[#C8102E] hover:underline font-medium tracking-wide uppercase">
          Сбросить все фильтры
        </button>
      </div>
    </aside>;
}