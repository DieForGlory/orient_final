const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:8000';

class PublicApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText
        }));
        throw new Error(error.detail || error.message || 'API Error');
      }
      return response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Products
  getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    collection?: string[];
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    // Обновленные типы для массивов (мультивыбор)
    brand?: string[];
    gender?: string[];
    minDiameter?: number;
    maxDiameter?: number;
    strapMaterial?: string[];
    movement?: string[];
    caseMaterial?: string[];
    dialColor?: string[];
    waterResistance?: string[];
    features?: string[];
  }) {
    const queryParams = new URLSearchParams();

    // Базовые параметры
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    // Одиночные параметры (диапазоны размеров)
    if (params?.minDiameter) queryParams.append('minDiameter', params.minDiameter.toString());
    if (params?.maxDiameter) queryParams.append('maxDiameter', params.maxDiameter.toString());

    // Хелпер для добавления массивов
    const appendArray = (key: string, values?: string[]) => {
      if (values && Array.isArray(values) && values.length > 0) {
        values.forEach(v => queryParams.append(key, v));
      }
    };

    // Массивы фильтров
    appendArray('collection', params?.collection);
    appendArray('brand', params?.brand);
    appendArray('gender', params?.gender);
    appendArray('strapMaterial', params?.strapMaterial);
    appendArray('movement', params?.movement);
    appendArray('caseMaterial', params?.caseMaterial);
    appendArray('dialColor', params?.dialColor);
    appendArray('waterResistance', params?.waterResistance);
    appendArray('features', params?.features);

    const query = queryParams.toString();
    return this.request(`/api/products${query ? `?${query}` : ''}`);
  }

  getProduct(id: string) {
    return this.request(`/api/products/${id}`);
  }

  // Filters
  getFilters() {
    return this.request('/api/products/filters');
  }

  // Collections
  getCollections() {
    return this.request('/api/collections');
  }

  getCollection(id: string) {
    return this.request(`/api/collections/${id}`);
  }

  getCollectionProducts(id: string, params?: { limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return this.request(`/api/collections/${id}/products${query ? `?${query}` : ''}`);
  }

  // Orders
  createOrder(data: any) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Bookings
  createBooking(data: any) {
    return this.request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Promo Codes
  validatePromoCode(code: string) {
    return this.request(`/api/promocodes/validate?code=${encodeURIComponent(code)}`);
  }

  // Content & Settings
  getSiteLogo() { return this.request('/api/content/logo'); }
  getHeroContent() { return this.request('/api/content/hero'); }
  getPromoBanner() { return this.request('/api/content/promo-banner'); }
  getFeaturedWatches() { return this.request('/api/content/featured-watches'); }
  getHeritageSection() { return this.request('/api/content/heritage'); }
  getBoutiqueContent() { return this.request('/api/content/boutique'); }
  getHistoryEvents() { return this.request('/api/content/history'); }
  getPolicy(slug: string) { return this.request(`/api/content/policy/${slug}`); }
  getCurrency() { return this.request('/api/settings/currency'); }
  getFilterSettings() { return this.request('/api/settings/filters'); }
  getShippingInfo() { return this.request('/api/settings/shipping'); }
  getSiteInfo() { return this.request('/api/settings/site'); }
  getSocialLinks() { return this.request('/api/settings/social'); }
}

export const publicApi = new PublicApiService();