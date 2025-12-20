import React, { useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { publicApi } from '../services/publicApi';

interface FilterRange {
  id: string;
  label: string;
  min: number;
  max: number;
}

interface FilterOptions {
  brands: { label: string; value: string; count: number }[];
  genders: { label: string; value: string; count: number }[];
  strapMaterials: { label: string; value: string; count: number }[];
  movements: { label: string; value: string; count: number }[];
  dialColors: { label: string; value: string; count: number }[];
  waterResistances: { label: string; value: string; count: number }[];
}

// Вспомогательная функция для бесконечного повтора запроса
async function fetchWithInfiniteRetry<T>(
  fn: () => Promise<T>,
  delay = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(`Ошибка загрузки фильтров, повтор через ${delay}мс...`, error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithInfiniteRetry(fn, delay);
  }
}

export function FilterSidebar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>([]);

  const [priceRanges, setPriceRanges] = useState<FilterRange[]>([]);
  const [diameterRanges, setDiameterRanges] = useState<FilterRange[]>([]);

  // Все фильтры свернуты по умолчанию
  const [openSections, setOpenSections] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // Запускаем параллельную загрузку всех данных для фильтров с бесконечным ретраем
      const [colData, filterData, settingsData] = await Promise.all([
        fetchWithInfiniteRetry(() => publicApi.getCollections()),
        fetchWithInfiniteRetry(() => publicApi.getFilters()),
        fetchWithInfiniteRetry(() => publicApi.getFilterSettings())
      ]);

      if (isMounted) {
        setCollections(colData);
        setFilters(filterData);

        setPriceRanges(settingsData.priceRanges || []);
        setDiameterRanges(settingsData.diameterRanges || []);
        setEnabledFeatures(settingsData.enabledFeatures || []);
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, []);

  const toggleSection = (title: string) => {
    setOpenSections(prev => prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]);
  };

  const handleMultiFilterChange = (key: string, value: string, checked: boolean) => {
    const currentValues = searchParams.getAll(key);

    if (checked) {
      if (!currentValues.includes(value)) {
        searchParams.append(key, value);
      }
    } else {
      searchParams.delete(key);
      currentValues
        .filter(v => v !== value)
        .forEach(v => searchParams.append(key, v));
    }

    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const handleRangeChange = (paramPrefix: string, min: number, max: number, checked: boolean) => {
    const minKey = `min${paramPrefix}`;
    const maxKey = `max${paramPrefix}`;

    searchParams.delete(minKey);
    searchParams.delete(maxKey);

    if (checked) {
      searchParams.set(minKey, min.toString());
      if (max > 0) searchParams.set(maxKey, max.toString());
    }

    searchParams.delete('page');
    setSearchParams(searchParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  // Пока данные не загрузятся (filters === null), показываем спиннер
  if (!filters) {
    return (
      <div className="w-full lg:w-80 bg-white p-8 flex flex-col items-center justify-center space-y-4 border-r border-black/10">
        <div className="w-8 h-8 border-2 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xs font-medium text-black/50 uppercase tracking-wider animate-pulse">
          Загрузка фильтров...
        </div>
      </div>
    );
  }

  return (
    <aside className="w-full lg:w-80 bg-white">
      <div className="pb-6 border-b border-black/10 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight uppercase">Фильтры</h2>
        <button onClick={clearFilters} className="text-xs text-[#C8102E] hover:underline uppercase font-bold">Сбросить</button>
      </div>

      <div className="divide-y divide-black/10">

        {/* 1. БРЕНД */}
        <FilterSection
          title="БРЕНД"
          isOpen={openSections.includes('БРЕНД')}
          onToggle={() => toggleSection('БРЕНД')}
        >
          {filters.brands.map(opt => (
            <CheckboxOption
              key={opt.value}
              label={opt.label}
              count={opt.count}
              checked={searchParams.getAll('brand').includes(opt.value)}
              onChange={(c: boolean) => handleMultiFilterChange('brand', opt.value, c)}
            />
          ))}
        </FilterSection>

        {/* 2. КОЛЛЕКЦИЯ */}
        <FilterSection
          title="КОЛЛЕКЦИЯ"
          isOpen={openSections.includes('КОЛЛЕКЦИЯ')}
          onToggle={() => toggleSection('КОЛЛЕКЦИЯ')}
        >
          {collections.map(col => (
            <CheckboxOption
              key={col.id}
              label={col.name}
              count={col.watchCount}
              checked={searchParams.getAll('collection').includes(col.name)}
              onChange={(c: boolean) => handleMultiFilterChange('collection', col.name, c)}
            />
          ))}
        </FilterSection>

        {/* 3. ГЕНДЕР */}
        <FilterSection
          title="ПОЛ"
          isOpen={openSections.includes('ПОЛ')}
          onToggle={() => toggleSection('ПОЛ')}
        >
          {filters.genders.map(opt => (
            <CheckboxOption
              key={opt.value}
              label={opt.label}
              count={opt.count}
              checked={searchParams.getAll('gender').includes(opt.value)}
              onChange={(c: boolean) => handleMultiFilterChange('gender', opt.value, c)}
            />
          ))}
        </FilterSection>

        {/* 4. ЦЕНА (Диапазоны - одиночный выбор) */}
        <FilterSection
          title="ЦЕНА"
          isOpen={openSections.includes('ЦЕНА')}
          onToggle={() => toggleSection('ЦЕНА')}
        >
          {priceRanges.map(range => (
            <CheckboxOption
              key={range.id}
              label={range.label}
              checked={searchParams.has('minPrice') && Number(searchParams.get('minPrice')) === range.min}
              onChange={(c: boolean) => handleRangeChange('Price', range.min, range.max, c)}
            />
          ))}
        </FilterSection>

        {/* 5. ДИАМЕТР КОРПУСА (Диапазоны - одиночный выбор) */}
        <FilterSection
          title="ДИАМЕТР КОРПУСА"
          isOpen={openSections.includes('ДИАМЕТР')}
          onToggle={() => toggleSection('ДИАМЕТР')}
        >
          {diameterRanges.map(range => (
            <CheckboxOption
              key={range.id}
              label={range.label}
              checked={searchParams.has('minDiameter') && Number(searchParams.get('minDiameter')) === range.min}
              onChange={(c: boolean) => handleRangeChange('Diameter', range.min, range.max, c)}
            />
          ))}
        </FilterSection>

        {/* 6. ОСОБЕННОСТИ */}
        {enabledFeatures.length > 0 && (
          <FilterSection
            title="ОСОБЕННОСТИ"
            isOpen={openSections.includes('ОСОБЕННОСТИ')}
            onToggle={() => toggleSection('ОСОБЕННОСТИ')}
          >
            {enabledFeatures.map(feature => (
              <CheckboxOption
                key={feature}
                label={feature}
                checked={searchParams.getAll('features').includes(feature)}
                onChange={(c: boolean) => handleMultiFilterChange('features', feature, c)}
              />
            ))}
          </FilterSection>
        )}

        {/* 7. ТИП МЕХАНИЗМА */}
        <FilterSection
          title="МЕХАНИЗМ"
          isOpen={openSections.includes('МЕХАНИЗМ')}
          onToggle={() => toggleSection('МЕХАНИЗМ')}
        >
          {filters.movements.map(opt => (
            <CheckboxOption
              key={opt.value}
              label={opt.label}
              count={opt.count}
              checked={searchParams.getAll('movement').includes(opt.value)}
              onChange={(c: boolean) => handleMultiFilterChange('movement', opt.value, c)}
            />
          ))}
        </FilterSection>

        {/* 8. МАТЕРИАЛ БРАСЛЕТА */}
        <FilterSection
          title="МАТЕРИАЛ БРАСЛЕТА"
          isOpen={openSections.includes('БРАСЛЕТ')}
          onToggle={() => toggleSection('БРАСЛЕТ')}
        >
          {filters.strapMaterials.map(opt => (
            <CheckboxOption
              key={opt.value}
              label={opt.label}
              count={opt.count}
              checked={searchParams.getAll('strapMaterial').includes(opt.value)}
              onChange={(c: boolean) => handleMultiFilterChange('strapMaterial', opt.value, c)}
            />
          ))}
        </FilterSection>

        {/* 9. ЦВЕТ ЦИФЕРБЛАТА */}
        <FilterSection
          title="ЦВЕТ ЦИФЕРБЛАТА"
          isOpen={openSections.includes('ЦИФЕРБЛАТ')}
          onToggle={() => toggleSection('ЦИФЕРБЛАТ')}
        >
          <div className="grid grid-cols-2 gap-2">
             {filters.dialColors.map(opt => (
              <CheckboxOption
                key={opt.value}
                label={opt.label}
                checked={searchParams.getAll('dialColor').includes(opt.value)}
                onChange={(c: boolean) => handleMultiFilterChange('dialColor', opt.value, c)}
              />
            ))}
          </div>
        </FilterSection>

        {/* 10. ВОДОНЕПРОНИЦАЕМОСТЬ КОРПУСА */}
        <FilterSection
          title="ВОДОНЕПРОНИЦАЕМОСТЬ КОРПУСА"
          isOpen={openSections.includes('ВОДОЗАЩИТА')}
          onToggle={() => toggleSection('ВОДОЗАЩИТА')}
        >
          {filters.waterResistances.map(opt => (
            <CheckboxOption
              key={opt.value}
              label={opt.label}
              count={opt.count}
              checked={searchParams.getAll('waterResistance').includes(opt.value)}
              onChange={(c: boolean) => handleMultiFilterChange('waterResistance', opt.value, c)}
            />
          ))}
        </FilterSection>

      </div>
    </aside>
  );
}

function FilterSection({ title, isOpen, onToggle, children }: any) {
  return (
    <div className="py-5">
      <button onClick={onToggle} className="flex items-center justify-between w-full mb-4 group">
        <h3 className="text-sm font-bold tracking-wider uppercase group-hover:text-[#C8102E] transition-colors">{title}</h3>
        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="space-y-3 animate-fade-in">{children}</div>}
    </div>
  );
}

function CheckboxOption({ label, count, checked, onChange }: any) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className={`w-4 h-4 border-2 flex items-center justify-center transition-colors ${checked ? 'border-[#C8102E] bg-[#C8102E]' : 'border-black/20 group-hover:border-black/40'}`}>
        {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
      </div>
      <input type="checkbox" className="hidden" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className={`text-sm flex-1 transition-colors ${checked ? 'text-black font-medium' : 'text-black/70 group-hover:text-black'}`}>{label}</span>
      {count !== undefined && <span className="text-xs text-black/40">({count})</span>}
    </label>
  );
}