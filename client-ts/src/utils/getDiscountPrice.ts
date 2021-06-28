export default function getDiscountPrice(
  standard: number | string,
  discount: number | string,
): string | 0 {
  const rate = 1 - Number(discount) / Number(standard);
  return Number.isNaN(rate) ? 0 : Math.round(rate * 100).toFixed(0);
}
