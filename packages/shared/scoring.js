// v1 scoring placeholders.
// In MVP, these fields can be set by ingestion/enrichment.
// You can harden/upgrade when you implement the CVE comps engine.

export function computeTargets({ cve_retail_proxy, cve_wholesale_mid }) {
  const retail = Number.isFinite(cve_retail_proxy) ? cve_retail_proxy : null;
  const wholesale = Number.isFinite(cve_wholesale_mid) ? cve_wholesale_mid : null;

  return {
    target_buy_private: retail !== null ? retail - 4000 : null,
    target_buy_wholesale: wholesale !== null ? wholesale - 2500 : null
  };
}

export function computeSpread({ list_price, target_buy_wholesale }) {
  if (!Number.isFinite(list_price) || !Number.isFinite(target_buy_wholesale)) return null;
  return list_price - target_buy_wholesale;
}

export function computeDealScore({ expected_spread, has_risk_title, confidence = 50 }) {
  // Clean-title-only: risk titles should be effectively zero score
  if (has_risk_title) return 0;

  const spread = Number.isFinite(expected_spread) ? expected_spread : 0;
  const base = Math.max(0, Math.min(100, Math.round((spread / 4000) * 100))); // 4k spread => 100
  const adj = Math.round((confidence - 50) * 0.3);
  return Math.max(0, Math.min(100, base + adj));
}
