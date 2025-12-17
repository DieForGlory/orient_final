import React, { useState, useEffect } from 'react';
import {
  Search, Filter, ChevronDown, Download, Eye,
  MoreVertical, CheckCircle, XCircle, Clock,
  Truck, CreditCard, User, MapPin, Calendar,
  Package, DollarSign
} from 'lucide-react';
import { api } from '../../services/api';

// Интерфейсы, соответствующие вашему бэкенду
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  sku?: string;
}

interface CustomerData {
  firstName?: string;
  lastName?: string;
  fullName?: string; // Иногда приходит так
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  comment?: string;
}

interface Order {
  id: string;           // ID из базы (строка или число)
  orderNumber: string;  // Номер заказа (ORD-...)
  status: string;
  total: number;
  subtotal?: number;
  date: string;         // ISO дата
  customer: CustomerData; // Данные клиента (parsed JSON)
  items: OrderItem[];     // Список товаров (parsed JSON)
  shipping?: {
    method: string;
    cost: number;
  };
  payment?: {
    method: string;
    status: string;
  };
  notes?: string;
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.getOrders({ limit: 100 });
      // Проверяем формат ответа (если бэкенд возвращает { data: [...] })
      const ordersData = Array.isArray(response) ? response : (response.data || []);
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      // Важно: используем orderNumber, если API ожидает его, или id
      await api.updateOrderStatus(orderId, newStatus);

      // Обновляем локально
      setOrders(orders.map(o =>
        o.orderNumber === orderId ? { ...o, status: newStatus } : o
      ));

      if (selectedOrder && selectedOrder.orderNumber === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Ошибка при обновлении статуса');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // --- ИСПРАВЛЕННАЯ ФИЛЬТРАЦИЯ ---
  const filteredOrders = orders.filter(order => {
    // Безопасное получение полей для поиска
    const searchLower = searchTerm.toLowerCase();

    // Получаем имя клиента (учитываем разные форматы)
    const clientName = (
      order.customer?.fullName ||
      `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`
    ).toLowerCase();

    const orderNum = (order.orderNumber || '').toLowerCase();
    const phone = (order.customer?.phone || '').toLowerCase();
    const email = (order.customer?.email || '').toLowerCase();

    const matchesSearch =
      orderNum.includes(searchLower) ||
      clientName.includes(searchLower) ||
      phone.includes(searchLower) ||
      email.includes(searchLower);

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const map: Record<string, string> = {
      'pending': 'Ожидает',
      'processing': 'В обработке',
      'shipped': 'Отправлен',
      'completed': 'Выполнен',
      'cancelled': 'Отменен'
    };
    return map[status] || status;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Нет даты';
    return new Date(dateString).toLocaleString('ru-RU');
  };

  // Компонент деталей заказа (модальное окно или панель)
  const OrderDetails = ({ order }: { order: Order }) => {
    if (!order) return null;

    // Безопасное получение данных
    const customerName = order.customer?.fullName ||
      `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim() || 'Гость';

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-end transition-opacity" onClick={() => setIsDetailsOpen(false)}>
        <div
          className="w-full max-w-2xl bg-white h-full shadow-2xl overflow-y-auto transform transition-transform"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Заказ #{order.orderNumber}</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <XCircle className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Управление статусом */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-sm font-bold uppercase text-gray-500 mb-3">Изменить статус</h3>
              <div className="flex gap-2 flex-wrap">
                {['pending', 'processing', 'shipped', 'completed', 'cancelled'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(order.orderNumber, status)}
                    disabled={updatingStatus || order.status === status}
                    className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors
                      ${order.status === status
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      } disabled:opacity-50`}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Клиент */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="flex items-center text-sm font-bold uppercase text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-2" />
                  Клиент
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="font-medium text-lg">{customerName}</div>
                  <div className="text-gray-600 flex items-center">
                    <span className="text-gray-400 mr-2">@</span>
                    {order.customer?.email || 'Не указан'}
                  </div>
                  <div className="text-gray-600 flex items-center">
                    <span className="text-gray-400 mr-2">📞</span>
                    {order.customer?.phone || 'Не указан'}
                  </div>
                  {order.customer?.comment && (
                     <div className="text-sm bg-yellow-50 p-3 rounded text-yellow-800 mt-2">
                       "{order.customer.comment}"
                     </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="flex items-center text-sm font-bold uppercase text-gray-500 mb-4">
                  <Truck className="w-4 h-4 mr-2" />
                  Доставка и Оплата
                </h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                  <div>
                    <div className="text-xs text-gray-400">Адрес доставки</div>
                    <div className="mt-1">{order.customer?.address || 'Самовывоз / Не указан'}</div>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between">
                    <span className="text-gray-500">Метод:</span>
                    <span className="font-medium">{order.shipping?.method || 'Стандарт'}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-500">Оплата:</span>
                     <span className="font-medium uppercase">{order.payment?.method || 'Наличные'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Товары */}
            <div className="mb-8">
              <h3 className="flex items-center text-sm font-bold uppercase text-gray-500 mb-4">
                <Package className="w-4 h-4 mr-2" />
                Товары ({order.items?.length || 0})
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-500">Наименование</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Цена</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Кол-во</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-500">Сумма</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3">
                            <div className="font-medium">{item.name}</div>
                            {item.sku && <div className="text-xs text-gray-400">SKU: {item.sku}</div>}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {item.price?.toLocaleString()} UZS
                          </td>
                          <td className="px-4 py-3 text-right">{item.quantity}</td>
                          <td className="px-4 py-3 text-right font-medium">
                            {(item.price * item.quantity)?.toLocaleString()} UZS
                          </td>
                        </tr>
                      ))
                    ) : (
                       <tr>
                         <td colSpan={4} className="px-4 py-6 text-center text-gray-500">Список товаров пуст</td>
                       </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-bold">ИТОГО:</td>
                      <td className="px-4 py-3 text-right font-bold text-lg">
                        {order.total?.toLocaleString()} UZS
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center mt-10">
              Заказ создан: {formatDate(order.date)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Заказы</h1>
          <p className="text-gray-500 mt-1">Управление заказами магазина</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
          <Download className="w-4 h-4 mr-2" />
          Экспорт CSV
        </button>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по номеру, имени или телефону..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>
        <div className="flex gap-4">
           <select
             className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-black/5"
             value={statusFilter}
             onChange={(e) => setStatusFilter(e.target.value)}
           >
             <option value="all">Все статусы</option>
             <option value="pending">Ожидает</option>
             <option value="processing">В обработке</option>
             <option value="shipped">Отправлен</option>
             <option value="completed">Выполнен</option>
             <option value="cancelled">Отменен</option>
           </select>
        </div>
      </div>

      {/* Список заказов */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            Заказов не найдено
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">Заказ</th>
                <th className="px-6 py-4">Дата</th>
                <th className="px-6 py-4">Клиент</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4 text-right">Сумма</th>
                <th className="px-6 py-4 text-center">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-medium font-mono text-sm">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(order.date)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm">
                      {order.customer?.fullName || 'Гость'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {order.customer?.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">
                    {order.total?.toLocaleString()} UZS
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsDetailsOpen(true);
                      }}
                      className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Модальное окно деталей */}
      {isDetailsOpen && selectedOrder && (
        <OrderDetails order={selectedOrder} />
      )}
    </div>
  );
}