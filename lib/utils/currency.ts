/** Indian Rupee formatting with lakh/crore grouping (₹3,12,000). */
export function formatINR(amount: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: fractionDigits,
  }).format(amount);
}

/** Compact rupees for large benefit values: ₹5 L, ₹1.5 Cr. */
export function formatINRCompact(amount: number): string {
  if (amount >= 10000000) {
    const cr = amount / 10000000;
    return `₹${cr.toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`;
  }
  if (amount >= 100000) {
    const l = amount / 100000;
    return `₹${l.toLocaleString("en-IN", { maximumFractionDigits: 2 })} L`;
  }
  return formatINR(amount);
}
