import { MXCache } from './mxCache';
import { retryWithBackoff } from './networkUtils';
import { identifyProvider } from './mxProviders';

const mxCache = new MXCache();

const cleanEmailDomain = (email: string): string => {
  try {
    const domain = email.split('@')[1];
    if (!domain) return '';
    return domain.split(/[?#]/)[0].toLowerCase();
  } catch {
    return '';
  }
};

export const cleanDomain = (url: string): string => {
  if (!url) return '';
  try {
    if (url.includes('@')) {
      return cleanEmailDomain(url);
    }

    let domain = url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split(/[/?#]/)[0]
      .replace(/\/+$/, '')
      .toLowerCase();
    
    return domain;
  } catch (error) {
    return '';
  }
};

const isValidDomain = (domain: string): boolean => {
  if (!domain) return false;
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/;
  return domainRegex.test(domain);
};

export const getMxProvider = async (domain: string): Promise<string> => {
  const cleanedDomain = cleanDomain(domain);
  
  if (!isValidDomain(cleanedDomain)) {
    return 'others';
  }

  const cached = mxCache.get(cleanedDomain);
  if (cached) return cached;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await retryWithBackoff(
      () => fetch(`https://dns.google/resolve?name=${encodeURIComponent(cleanedDomain)}&type=mx`, {
        signal: controller.signal
      }),
      3,
      { 
        initialDelay: 1000,
        backoffFactor: 2,
        maxRetries: 2
      }
    );

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.Answer || data.Answer.length === 0) {
      const provider = 'others';
      mxCache.set(cleanedDomain, provider);
      return provider;
    }

    const mxRecords = data.Answer.map((record: any) => record.data.toLowerCase());
    const provider = identifyProvider(mxRecords);
    mxCache.set(cleanedDomain, provider);
    return provider;
  } catch (error) {
    // Don't log timeout errors as they're expected
    if (error.name !== 'AbortError') {
      console.error(`Error fetching MX records for ${cleanedDomain}:`, error);
    }
    const provider = 'others';
    mxCache.set(cleanedDomain, provider);
    return provider;
  }
};