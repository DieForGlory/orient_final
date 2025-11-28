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
interface SettingsContextType {
  currency: Currency;
  site: SiteInfo;
  social: SocialLinks;
  formatPrice: (price: number) => string;
  loading: boolean;
}
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
export function SettingsProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [currency, setCurrency] = useState<Currency>({
    code: 'UZS',
    symbol: '₽'
  });
  const [site, setSite] = useState<SiteInfo>({
    name: 'Orient Watch',
    email: 'info@orient.uz',
    phone: '+998 71 123 45 67',
    address: 'Ташкент, Узбекистан'
  });
  const [social, setSocial] = useState<SocialLinks>({
    facebook: 'https://facebook.com/orient',
    instagram: 'https://instagram.com/orient',
    twitter: 'https://twitter.com/orient'
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSettings();
  }, []);
  const fetchSettings = async () => {
    try {
      const currencyData = await publicApi.getCurrency();
      setCurrency(currencyData);
      // Try to get full settings, fallback to defaults
      try {
        const siteData = await publicApi.getSiteInfo();
        setSite(siteData);
      } catch (e) {
        console.log('Using default site info');
      }
      try {
        const socialData = await publicApi.getSocialLinks();
        setSocial(socialData);
      } catch (e) {
        console.log('Using default social links');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };
  const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} ${currency.symbol}`;
  };
  return <SettingsContext.Provider value={{
    currency,
    site,
    social,
    formatPrice,
    loading
  }}>
      {children}
    </SettingsContext.Provider>;
}
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}