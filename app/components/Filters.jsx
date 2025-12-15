import React, { useEffect, useState } from "react";
import { listMarkets } from "../src/api.js";

export default function Filters({ value, onChange, onApply, loading }) {
  const [markets, setMarkets] = useState([]);

  useEffect(() => {
    listMarkets()
      .then(r => setMarkets(r.data || []))
      .catch(() => setMarkets([]));
  }, []);

  function setField(k, v) {
    onChange({ ...value, [k]: v });
  }

  return (
    <div className="card">
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Filters</div>

      <div className="row">
        <div className="field" style={{ minWidth: 240 }}>
          <label>Market</label>
          <select value={value.market_id} onChange={(e) => setField("market_id", e.target.value)}>
            <option value="">All markets</option>
            {markets.map(m => (
              <option key={m.id} value={m.id}>{m.name}{m.state ? `, ${m.state}` : ""}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Min Score</label>
          <input value={value.min_score} onChange={(e) => setField("min_score", e.target.value)} placeholder="0" />
        </div>

        <div className="field">
          <label>Min Price</label>
          <input value={value.min_price} onChange={(e) => setField("min_price", e.target.value)} placeholder="e.g. 5000" />
        </div>

        <div className="field">
          <label>Max Price</label>
          <input value={value.max_price} onChange={(e) => setField("max_price", e.target.value)} placeholder="e.g. 30000" />
        </div>

        <div className="field">
          <label>Min Miles</label>
          <input value={value.min_miles} onChange={(e) => setField("min_miles", e.target.value)} placeholder="e.g. 0" />
        </div>

        <div className="field">
          <label>Max Miles</label>
          <input value={value.max_miles} onChange={(e) => setField("max_miles", e.target.value)} placeholder="e.g. 120000" />
        </div>
      </div>

      <div className="row" style={{ marginTop: 10 }}>
        <div className="field" style={{ minWidth: 220 }}>
          <label>Title Status Visibility</label>
          <div className="row" style={{ gap: 8, alignItems: "center" }}>
            <label className="badge">
              <input
                type="checkbox"
                checked={value.include_unknown === "true"}
                onChange={(e) => setField("include_unknown", e.target.checked ? "true" : "false")}
              />
              Include UNKNOWN
            </label>
            <label className="badge">
              <input
                type="checkbox"
                checked={value.include_risk === "true"}
                onChange={(e) => setField("include_risk", e.target.checked ? "true" : "false")}
              />
              Include RISK (not buyable)
            </label>
          </div>
        </div>

        <button onClick={onApply} disabled={loading}>
          {loading ? "Loading..." : "Apply"}
        </button>
      </div>

      <div className="muted" style={{ marginTop: 10, fontSize: 12 }}>
        Default is CLEAN only. Your buy box is enforced by the API unless you explicitly include UNKNOWN/RISK.
      </div>
    </div>
  );
}
