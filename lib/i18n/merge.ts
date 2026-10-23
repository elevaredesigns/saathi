/**
 * Recursive merge used for per-key translation fallback: English is the base,
 * a locale's file overrides whatever it has translated. Arrays and scalars are
 * replaced wholesale (a half-translated list would read worse than English).
 */
type Plain = Record<string, unknown>;

const isPlain = (v: unknown): v is Plain => typeof v === "object" && v !== null && !Array.isArray(v);

export function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlain(base)) return (override === undefined ? base : override) as T;
  if (!isPlain(override)) return (override === undefined ? { ...base } : override) as T;

  const out: Plain = { ...base };
  for (const key of Object.keys(override)) {
    const value = override[key];
    if (value === undefined) continue;
    out[key] = isPlain(base[key]) && isPlain(value) ? deepMerge(base[key], value) : value;
  }
  return out as T;
}
