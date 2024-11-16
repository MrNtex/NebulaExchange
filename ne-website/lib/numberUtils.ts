export function roundTo(num: number, places: number) {
  const factor = Math.pow(10, places);
  return Math.round(num * factor) / factor;
}

export function formatNumber(num: number, currency = "USD") {
  const numString = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (currency === "USD") {
    return `$${numString}`;
  }

  return numString + ` ${currency}`;
}