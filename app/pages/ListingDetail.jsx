import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getListingDetail } from "../api.js";
import FlagChips from "../components/FlagChips.jsx";

function money(n) {
  if (n === null || n === undefined) return "—";
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function ListingDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: "", listing: null, flags: [], images: [] });

  useEffect(() => {
    (async () => {
      try {
        const res = await getListingDetail(id);
        setState({ loading: false, error: "", listing: res.listing, flags: res.flags || [], images: res.images || [] });
      } catch (e) {
        setState({ loading: false, error: e.message || "Failed", listing: null, flags: [], images: [] });
      }
    })();
  }, [id]);

  if (state.loading) return <div className="card">Loading…</div>;
  if (state.error) return <div className="card">{state.error}</div>;
  if (!state.listing) return <div className="card">Not found.</div>;

  const l = state.listing;

  return (
    <div className="grid two">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start" }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18 }}>
              {l.year || ""} {l.make || ""} {l.model || ""} {l.trim || ""}
            </div>
            <div className="muted" style={{ marginTop: 6 }}>
              <a href={l.listing_url} target="_blank" rel="noreferrer">Open original listing</a>
              <span className="muted"> · </span>
              <Link to="/">Back to Buy List</Link>
            </div>
          </div>
          <div className="badge">
            Title Status: <strong>{l.title_status}</strong>
          </div>
        </div>

        <div className="kpi" style={{ marginTop: 12 }}>
          <div className="item">
            <div className="label">List Price</div>
            <div className="value">{money(l.price)}</div>
          </div>
          <div className="item">
            <div className="label">Mileage</div>
            <div className="value">{l.mileage ? l.mileage.toLocaleString() : "—"}</div>
          </div>
          <div className="item">
            <div className="label">Deal Score</div>
            <div className="value">{l.deal_score ?? "—"}</div>
          </div>
          <div className="item">
            <div className="label">Confidence</div>
            <div className="value">{l.confidence ?? "—"}</div>
          </div>
          <div className="item">
            <div className="label">Target Buy (Wholesale)</div>
            <div className="value">{money(l.target_buy_wholesale)}</div>
          </div>
          <div className="item">
            <div className="label">Expected Spread</div>
            <div className="value">{money(l.expected_spread)}</div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 700 }}>VIN / Plate Signals</div>
          <div style={{ marginTop: 8 }}>
            <FlagChips listing={l} />
          </div>
          <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
            VIN storage: masked + hash only (raw VIN not exposed in UI).
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 700 }}>Title</div>
          <div className="muted" style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{l.title || "—"}</div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div style={{ fontWeight: 700 }}>Description</div>
          <div className="muted" style={{ marginTop: 6, whiteSpace: "pre-wrap" }}>{l.description || "—"}</div>
        </div>
      </div>

      <div className="grid" style={{ gap: 12 }}>
        <div className="card">
          <div style={{ fontWeight: 700 }}>Flags</div>
          {state.flags.length ? (
            <div style={{ marginTop: 10 }}>
              {state.flags.map(f => (
                <div key={f.id} style={{ padding: "8px 0", borderBottom: "1px solid #eee" }}>
                  <div style={{ fontWeight: 700 }}>{f.flag_type} <span className="muted">(conf {f.confidence})</span></div>
                  <div className="muted" style={{ marginTop: 6 }}>{f.evidence || ""}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted" style={{ marginTop: 10 }}>No flags recorded.</div>
          )}
        </div>

        <div className="card">
          <div style={{ fontWeight: 700 }}>Images</div>
          {state.images.length ? (
            <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {state.images.map(img => (
                <a key={img.id} href={img.image_url} target="_blank" rel="noreferrer">
                  <img
                    src={img.image_url}
                    alt="listing"
                    style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 10, border: "1px solid #eee" }}
                  />
                </a>
              ))}
            </div>
          ) : (
            <div className="muted" style={{ marginTop: 10 }}>No images stored.</div>
          )}
        </div>
      </div>
    </div>
  );
}
