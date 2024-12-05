export function roundTo(num: number, places: number) {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
}

export function formatNumber(num: number): string;
export function formatNumber(num: number, currency: string): string;
export function formatNumber(num: number, currency?: string): string {
  const numString = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (currency) {
    currency = currency.toUpperCase();
    if (currency === "USD") {
      return `$${numString}`;
    }
    return `${numString} ${currency}`;
  }
  return numString;
}