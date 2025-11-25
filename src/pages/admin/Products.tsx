import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, EditIcon, TrashIcon, EyeIcon, DownloadIcon, UploadIcon } from 'lucide-react';
import { api } from '../../services/api';
interface Product {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  inStock: boolean;
  createdAt: string;
}
export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCollection, setFilterCollection] = useState('all');
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    try {
      const response = await api.getProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Ошибка при удалении товара');
    }
  };
  const handleExport = async () => {
    setExporting(true);
    try {
      await api.exportProducts();
      alert('✅ Каталог успешно экспортирован!');
    } catch (error) {
      console.error('Error exporting products:', error);
      alert('❌ Ошибка при экспорте каталога');
    } finally {
      setExporting(false);
    }
  };
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('❌ Пожалуйста, выберите Excel файл (.xlsx или .xls)');
      return;
    }
    setImporting(true);
    try {
      const result = await api.importProducts(file);
      // Show detailed result
      const message = `✅ Импорт завершен!\n\n` + `Создано: ${result.created}\n` + `Обновлено: ${result.updated}\n` + (result.errors.length > 0 ? `\nОшибки:\n${result.errors.join('\n')}` : '');
      alert(message);
      // Refresh products list
      await fetchProducts();
    } catch (error: any) {
      console.error('Error importing products:', error);
      alert(`❌ Ошибка при импорте: ${error.message}`);
    } finally {
      setImporting(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection = filterCollection === 'all' || product.collection === filterCollection;
    return matchesSearch && matchesCollection;
  });
  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </div>;
  }
  return <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Товары
          </h1>
          <p className="text-sm sm:text-base text-black/60">
            Управление товарами в каталоге
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button onClick={handleExport} disabled={exporting} className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-3 text-sm tracking-wider font-semibold transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed">
            {exporting ? <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Экспорт...</span>
              </> : <>
                <DownloadIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                <span>Скачать каталог</span>
              </>}
          </button>

          <button onClick={handleImportClick} disabled={importing} className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 text-sm tracking-wider font-semibold transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed">
            {importing ? <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Импорт...</span>
              </> : <>
                <UploadIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
                <span>Импортировать</span>
              </>}
          </button>
          <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />

          <Link to="/admin/products/new" className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-[#C8102E] hover:bg-[#A00D24] text-white px-4 sm:px-6 py-3 text-sm tracking-wider font-semibold transition-all uppercase">
            <PlusIcon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
            <span>Добавить товар</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 sm:p-6 border-2 border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative">
            <SearchIcon className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-black/40" strokeWidth={2} />
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Поиск товаров..." className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-black/20 focus:border-[#C8102E] focus:outline-none" />
          </div>

          {/* Collection Filter */}
          <select value={filterCollection} onChange={e => setFilterCollection(e.target.value)} className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-black/20 focus:border-[#C8102E] focus:outline-none bg-white">
            <option value="all">Все коллекции</option>
            <option value="SPORTS">SPORTS</option>
            <option value="CLASSIC">CLASSIC</option>
            <option value="CONTEMPORARY">CONTEMPORARY</option>
          </select>
        </div>
      </div>

      {/* Products Table - Desktop */}
      <div className="hidden md:block bg-white border-2 border-black/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-black/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-black/60">
                  Товар
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-black/60">
                  Коллекция
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-black/60">
                  Цена
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-black/60">
                  Статус
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-black/60">
                  Дата
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-black/60">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {filteredProducts.length > 0 ? filteredProducts.map(product => <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover bg-gray-100" onError={e => {
                    e.currentTarget.src = 'https://via.placeholder.com/64?text=No+Image';
                  }} />
                        <div>
                          <p className="font-semibold text-sm">
                            {product.name}
                          </p>
                          <p className="text-xs text-black/50">
                            ID: {product.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">
                        {product.collection}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.inStock ? 'В наличии' : 'Нет в наличии'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black/60">
                      {product.createdAt}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link to={`/product/${product.id}`} target="_blank" className="p-2 hover:bg-gray-100 transition-colors" title="Просмотр">
                          <EyeIcon className="w-4 h-4" strokeWidth={2} />
                        </Link>
                        <Link to={`/admin/products/${product.id}/edit`} className="p-2 hover:bg-gray-100 transition-colors" title="Редактировать">
                          <EditIcon className="w-4 h-4" strokeWidth={2} />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="p-2 hover:bg-red-50 text-red-600 transition-colors" title="Удалить">
                          <TrashIcon className="w-4 h-4" strokeWidth={2} />
                        </button>
                      </div>
                    </td>
                  </tr>) : <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-black/40">
                    {searchQuery || filterCollection !== 'all' ? 'Товары не найдены' : 'Нет товаров'}
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length > 0 ? filteredProducts.map(product => <div key={product.id} className="bg-white border-2 border-black/10 p-4">
              <div className="flex gap-4 mb-4">
                <img src={product.image} alt={product.name} className="w-20 h-20 object-cover bg-gray-100 flex-shrink-0" onError={e => {
            e.currentTarget.src = 'https://via.placeholder.com/80?text=No+Image';
          }} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm mb-1 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-black/50 mb-2">ID: {product.id}</p>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold uppercase ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.inStock ? 'В наличии' : 'Нет'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-black/60">Коллекция:</span>
                  <span className="font-medium">{product.collection}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Цена:</span>
                  <span className="font-bold">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black/60">Дата:</span>
                  <span>{product.createdAt}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/product/${product.id}`} target="_blank" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-black/20 hover:bg-gray-50 transition-colors text-sm font-medium">
                  <EyeIcon className="w-4 h-4" strokeWidth={2} />
                  <span>Просмотр</span>
                </Link>
                <Link to={`/admin/products/${product.id}/edit`} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border-2 border-black/20 hover:bg-gray-50 transition-colors text-sm font-medium">
                  <EditIcon className="w-4 h-4" strokeWidth={2} />
                  <span>Изменить</span>
                </Link>
                <button onClick={() => handleDelete(product.id)} className="px-3 py-2 border-2 border-red-200 hover:bg-red-50 text-red-600 transition-colors" title="Удалить">
                  <TrashIcon className="w-4 h-4" strokeWidth={2} />
                </button>
              </div>
            </div>) : <div className="bg-white border-2 border-black/10 p-8 text-center text-black/40">
            {searchQuery || filterCollection !== 'all' ? 'Товары не найдены' : 'Нет товаров'}
          </div>}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-black/60">
            Показано {filteredProducts.length} из {products.length} товаров
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 sm:px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all text-xs sm:text-sm font-medium uppercase tracking-wider">
              Пред.
            </button>
            <button className="px-3 sm:px-4 py-2 bg-black text-white text-xs sm:text-sm font-medium uppercase tracking-wider">
              1
            </button>
            <button className="px-3 sm:px-4 py-2 border-2 border-black hover:bg-black hover:text-white transition-all text-xs sm:text-sm font-medium uppercase tracking-wider">
              След.
            </button>
          </div>
        </div>}
    </div>;
}