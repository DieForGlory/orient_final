import React, { useEffect, useState, createContext, useContext } from 'react';
import { publicApi } from '../services/publicApi';

interface Currency {
  code: string;
  symbol: string;
}

interface SiteInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
}

// Интерфейс доставки
interface ShippingInfo {
  freeShippingThreshold: number;
  standardCost: number;
  expressCost: number;
}

interface SettingsContextType {
  currency: Currency;
  site: SiteInfo;
  social: SocialLinks;
  shipping: ShippingInfo;
  formatPrice: (price: number) => string;
  loading: boolean;
}

// Вспомогательная функция для бесконечного повтора запроса
async function fetchWithInfiniteRetry<T>(
  fn: () => Promise<T>,
  delay = 2000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    console.warn(`Ошибка загрузки настроек, повтор через ${delay}мс...`, error);
    await new Promise(resolve => setTimeout(resolve, delay));
    return fetchWithInfiniteRetry(fn, delay);
  }
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Дефолтные состояния (пока грузится)
  const [currency, setCurrency] = useState<Currency>({
    code: 'UZS',
    symbol: 'UZS'
  });
  const [site, setSite] = useState<SiteInfo>({
    name: 'Orient Watch',
    email: '',
    phone: '',
    address: ''
  });
  const [social, setSocial] = useState<SocialLinks>({
    facebook: '',
    instagram: '',
    twitter: ''
  });
  const [shipping, setShipping] = useState<ShippingInfo>({
    freeShippingThreshold: 0,
    standardCost: 0,
    expressCost: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      // Загружаем все настройки параллельно с бесконечным ретраем.
      // Это гарантирует, что валюта в каталоге и контакты в бутике
      // будут загружены с сервера, даже если он тупит.
      const [currencyData, siteData, socialData, shippingData] = await Promise.all([
        fetchWithInfiniteRetry(() => publicApi.getCurrency()),
        fetchWithInfiniteRetry(() => publicApi.getSiteInfo()),
        fetchWithInfiniteRetry(() => publicApi.getSocialLinks()),
        fetchWithInfiniteRetry(() => publicApi.getShippingInfo())
      ]);

      if (isMounted) {
        setCurrency(currencyData);
        setSite(siteData);
        setSocial(socialData);
        setShipping(shippingData);
        setLoading(false);
      }
    };

    fetchSettings();

    return () => { isMounted = false; };
  }, []);

  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} ${currency.symbol}`;
  };

  return (
    <SettingsContext.Provider value={{
      currency,
      site,
      social,
      shipping,
      formatPrice,
      loading
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}