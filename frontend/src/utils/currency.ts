export const CURRENCY_RATES = {
  TON_TO_USD: 2.5,
  OZR_TO_USD: 0.006,
};

export const formatCurrency = (amount: number, currency: 'USD' | 'TON' | 'OZR'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace('$', currency === 'TON' ? 'TON ' : currency === 'OZR' ? 'OZR ' : '$');
};

export const convertCurrency = {
  tonToUsd: (ton: number): number => ton * CURRENCY_RATES.TON_TO_USD,
  usdToTon: (usd: number): number => usd / CURRENCY_RATES.TON_TO_USD,
  ozrToUsd: (ozr: number): number => ozr * CURRENCY_RATES.OZR_TO_USD,
  ozrToTon: (ozr: number): number => (ozr * CURRENCY_RATES.OZR_TO_USD) / CURRENCY_RATES.TON_TO_USD,
  usdToOzr: (usd: number): number => usd / CURRENCY_RATES.OZR_TO_USD,
  tonToOzr: (ton: number): number => (ton * CURRENCY_RATES.TON_TO_USD) / CURRENCY_RATES.OZR_TO_USD,
};
