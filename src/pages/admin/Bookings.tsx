import React, { useEffect, useState } from 'react';
import {
  CalendarIcon, ClockIcon, MailIcon, PhoneIcon, UserIcon,
  MapPinIcon, CheckCircleIcon, XCircleIcon, ClockIcon as PendingIcon,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';

interface Booking {
  id: number;
  booking_number: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  message: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  boutique: string;
  created_at: string;
}

interface BookingStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<BookingStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Состояния для фильтров и пагинации
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [filterStatus, page]); // Перезагружаем при смене статуса или страницы

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Передаем page и limit (20)
      const response = await api.getBookings(filterStatus || undefined, page, 20);

      // Обрабатываем ответ (учитываем структуру с пагинацией)
      if (response.data && Array.isArray(response.data)) {
        setBookings(response.data);
        setPagination(response.pagination); // Сохраняем инфо о страницах
      } else if (Array.isArray(response)) {
        // Fallback если бэкенд вернул просто массив (старый формат)
        setBookings(response);
        setPagination(null);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.getBookingsStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await api.updateBookingStatus(bookingId, status);
      fetchBookings(); // Обновляем текущую страницу
      fetchStats();
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Ошибка при обновлении статуса');
    }
  };

  // Сброс страницы при смене фильтра
  const handleFilterChange = (newStatus: string) => {
    setFilterStatus(newStatus);
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      'pending': 'Ожидает',
      'confirmed': 'Подтверждено',
      'completed': 'Завершено',
      'cancelled': 'Отменено'
    };
    return map[status] || status;
  };

  if (loading && !bookings.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Записи в бутик
          </h1>
          <p className="text-black/60 mt-2">Управление записями на визит</p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Всего</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <CalendarIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          {/* ... остальные карточки можно оставить такими же или упростить ... */}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Статус:</label>
          <select
            value={filterStatus}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="">Все записи</option>
            <option value="pending">Ожидают</option>
            <option value="confirmed">Подтверждено</option>
            <option value="completed">Завершено</option>
            <option value="cancelled">Отменено</option>
          </select>
        </div>

        {/* Индикатор загрузки (маленький) */}
        {loading && <div className="text-sm text-gray-500">Загрузка...</div>}
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white p-12 text-center border border-gray-200 rounded-lg">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Записей не найдено</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-6">

                {/* Info Column */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold font-mono">#{booking.booking_number}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(booking.created_at).toLocaleString('ru-RU')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{booking.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <a href={`tel:${booking.phone}`} className="hover:text-blue-600">{booking.phone}</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span>{new Date(booking.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{booking.boutique}</span>
                    </div>
                  </div>

                  {booking.message && (
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 uppercase mb-1">Комментарий</p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{booking.message}</p>
                    </div>
                  )}
                </div>

                {/* Actions Column */}
                <div className="flex lg:flex-col gap-2 justify-center lg:justify-start lg:w-40 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Подтвердить
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 hover:bg-red-50 hover:text-red-600 text-gray-700 text-sm font-medium rounded transition-colors"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Отменить
                      </button>
                    </>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      Завершить
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Назад
            </button>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Вперед
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано с <span className="font-medium">{(page - 1) * 20 + 1}</span> по{' '}
                <span className="font-medium">{Math.min(page * 20, pagination.total)}</span> из{' '}
                <span className="font-medium">{pagination.total}</span> записей
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Назад</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Номера страниц (упрощенно) */}
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                  Страница {page} из {pagination.totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                  <span className="sr-only">Вперед</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}