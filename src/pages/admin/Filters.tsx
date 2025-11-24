import React, { useEffect, useState } from 'react';
import { SaveIcon, PlusIcon, TrashIcon, GripVerticalIcon } from 'lucide-react';
interface FilterOption {
  id: string;
  label: string;
  value: string;
}
interface FilterConfig {
  collections: FilterOption[];
  priceRanges: {
    id: string;
    label: string;
    min: number;
    max: number;
  }[];
  features: FilterOption[];
  movements: FilterOption[];
}
export function AdminFilters() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<FilterConfig>({
    collections: [{
      id: '1',
      label: 'Sports',
      value: 'SPORTS'
    }, {
      id: '2',
      label: 'Classic',
      value: 'CLASSIC'
    }, {
      id: '3',
      label: 'Contemporary',
      value: 'CONTEMPORARY'
    }],
    priceRanges: [{
      id: '1',
      label: 'До 30 000 ₽',
      min: 0,
      max: 30000
    }, {
      id: '2',
      label: '30 000 - 50 000 ₽',
      min: 30000,
      max: 50000
    }, {
      id: '3',
      label: '50 000 - 70 000 ₽',
      min: 50000,
      max: 70000
    }, {
      id: '4',
      label: 'От 70 000 ₽',
      min: 70000,
      max: 999999
    }],
    features: [{
      id: '1',
      label: 'Автоматический механизм',
      value: 'automatic'
    }, {
      id: '2',
      label: 'Водонепроницаемость 200м',
      value: 'waterproof-200'
    }, {
      id: '3',
      label: 'Сапфировое стекло',
      value: 'sapphire'
    }, {
      id: '4',
      label: 'Светящиеся стрелки',
      value: 'luminous'
    }],
    movements: [{
      id: '1',
      label: 'Автоматический',
      value: 'automatic'
    }, {
      id: '2',
      label: 'Механический',
      value: 'mechanical'
    }, {
      id: '3',
      label: 'Кварцевый',
      value: 'quartz'
    }]
  });
  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Save to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Настройки фильтров сохранены!');
    } catch (error) {
      console.error('Error saving filters:', error);
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };
  const addPriceRange = () => {
    const newRange = {
      id: Date.now().toString(),
      label: '',
      min: 0,
      max: 0
    };
    setConfig({
      ...config,
      priceRanges: [...config.priceRanges, newRange]
    });
  };
  const removePriceRange = (id: string) => {
    setConfig({
      ...config,
      priceRanges: config.priceRanges.filter(r => r.id !== id)
    });
  };
  const updatePriceRange = (id: string, updates: Partial<(typeof config.priceRanges)[0]>) => {
    setConfig({
      ...config,
      priceRanges: config.priceRanges.map(r => r.id === id ? {
        ...r,
        ...updates
      } : r)
    });
  };
  const addFeature = () => {
    const newFeature = {
      id: Date.now().toString(),
      label: '',
      value: ''
    };
    setConfig({
      ...config,
      features: [...config.features, newFeature]
    });
  };
  const removeFeature = (id: string) => {
    setConfig({
      ...config,
      features: config.features.filter(f => f.id !== id)
    });
  };
  const updateFeature = (id: string, updates: Partial<FilterOption>) => {
    setConfig({
      ...config,
      features: config.features.map(f => f.id === id ? {
        ...f,
        ...updates
      } : f)
    });
  };
  return <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Настройка фильтров
          </h1>
          <p className="text-black/60">
            Управление фильтрами в каталоге товаров
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center space-x-2 bg-[#C8102E] hover:bg-[#A00D24] text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-all disabled:opacity-50">
          <SaveIcon className="w-5 h-5" strokeWidth={2} />
          <span>Сохранить все</span>
        </button>
      </div>

      {/* Price Ranges */}
      <div className="bg-white p-8 border-2 border-black/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              Ценовые диапазоны
            </h2>
            <p className="text-sm text-black/60 mt-1">
              Настройте диапазоны цен для фильтра
            </p>
          </div>
          <button onClick={addPriceRange} className="flex items-center space-x-2 border-2 border-black hover:bg-black hover:text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all">
            <PlusIcon className="w-4 h-4" strokeWidth={2} />
            <span>Добавить</span>
          </button>
        </div>

        <div className="space-y-4">
          {config.priceRanges.map((range, index) => <div key={range.id} className="flex items-center gap-4 p-4 border-2 border-black/10">
              <GripVerticalIcon className="w-5 h-5 text-black/40 cursor-move" strokeWidth={2} />

              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase mb-2">
                    Название
                  </label>
                  <input type="text" value={range.label} onChange={e => updatePriceRange(range.id, {
                label: e.target.value
              })} className="w-full px-3 py-2 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none text-sm" placeholder="До 30 000 ₽" />
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase mb-2">
                    Мин. цена
                  </label>
                  <input type="number" value={range.min} onChange={e => updatePriceRange(range.id, {
                min: parseInt(e.target.value)
              })} className="w-full px-3 py-2 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none text-sm" placeholder="0" />
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase mb-2">
                    Макс. цена
                  </label>
                  <input type="number" value={range.max} onChange={e => updatePriceRange(range.id, {
                max: parseInt(e.target.value)
              })} className="w-full px-3 py-2 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none text-sm" placeholder="30000" />
                </div>
              </div>

              <button onClick={() => removePriceRange(range.id)} className="p-2 text-black/40 hover:text-[#C8102E] hover:bg-red-50 transition-all">
                <TrashIcon className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>)}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white p-8 border-2 border-black/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight uppercase">
              Особенности
            </h2>
            <p className="text-sm text-black/60 mt-1">
              Настройте фильтр по особенностям часов
            </p>
          </div>
          <button onClick={addFeature} className="flex items-center space-x-2 border-2 border-black hover:bg-black hover:text-white px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-all">
            <PlusIcon className="w-4 h-4" strokeWidth={2} />
            <span>Добавить</span>
          </button>
        </div>

        <div className="space-y-4">
          {config.features.map(feature => <div key={feature.id} className="flex items-center gap-4 p-4 border-2 border-black/10">
              <GripVerticalIcon className="w-5 h-5 text-black/40 cursor-move" strokeWidth={2} />

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase mb-2">
                    Название
                  </label>
                  <input type="text" value={feature.label} onChange={e => updateFeature(feature.id, {
                label: e.target.value
              })} className="w-full px-3 py-2 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none text-sm" placeholder="Автоматический механизм" />
                </div>

                <div>
                  <label className="block text-xs font-medium tracking-wider uppercase mb-2">
                    Значение (для фильтра)
                  </label>
                  <input type="text" value={feature.value} onChange={e => updateFeature(feature.id, {
                value: e.target.value
              })} className="w-full px-3 py-2 border-2 border-black/20 focus:border-[#C8102E] focus:outline-none text-sm" placeholder="automatic" />
                </div>
              </div>

              <button onClick={() => removeFeature(feature.id)} className="p-2 text-black/40 hover:text-[#C8102E] hover:bg-red-50 transition-all">
                <TrashIcon className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>)}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border-2 border-blue-200 p-6">
        <h3 className="font-semibold mb-2">ℹ️ Информация</h3>
        <ul className="text-sm text-black/70 space-y-1">
          <li>
            • Коллекции подтягиваются автоматически из раздела "Коллекции"
          </li>
          <li>• Ценовые диапазоны используются для быстрого фильтра по цене</li>
          <li>• Особенности должны совпадать с характеристиками товаров</li>
          <li>• Изменения применятся на сайте сразу после сохранения</li>
        </ul>
      </div>
    </div>;
}