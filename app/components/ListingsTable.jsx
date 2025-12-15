import React from "react";
import { Link } from "react-router-dom";
import FlagChips from "./FlagChips.jsx";

function money(n) {
  if (n === null || n === undefined) return "—";
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export default function ListingsTable({ listings }) {
  if (!listings?.length) {
    return <div className="card">No results.</div>;
  }

  return (
    <div className="card">
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Price</th>
              <th>Miles</th>
              <th>Title</th>
              <th>Deal Score</th>
              <th>Target Buy (W)</th>
              <th>Expected Spread</th>
              <th>VIN/Plate Signals</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr key={l.id}>
                <td>
                  <div style={{ fontWeight: 700 }}>
                    <Link to={`/listing/${l.id}`} style={{ textDecoration: "none" }}>
                      {l.year || ""} {l.make || ""} {l.model || ""} {l.trim || ""}
                    </Link>
                  </div>
                  <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
                    <a href={l.listing_url} target="_blank" rel="noreferrer">Open listing</a>
                  </div>
                  <div className="muted" style={{ marginTop: 6 }}>{l.title || ""}</div>
                </td>
                <td>{money(l.price)}</td>
                <td>{l.mileage?.toLocaleString?.() || "—"}</td>
                <td>{l.title_status}</td>
                <td style={{ fontWeight: 700 }}>{l.deal_score ?? "—"}</td>
                <td>{money(l.target_buy_wholesale)}</td>
                <td>{money(l.expected_spread)}</td>
                <td><FlagChips listing={l} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
