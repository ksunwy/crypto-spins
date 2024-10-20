export function formatNumber(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      useGrouping: true,
    });
}

export function decimalFormat(value: number): string {
  const [integerPart, decimalPart] = value.toString().split(".");
  return decimalPart ? `${integerPart},${decimalPart}` : integerPart;
}
