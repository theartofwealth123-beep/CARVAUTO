import React from "react";

export default function FlagChips({ listing }) {
  const chips = [];

  if (listing?.plate_detected) chips.push("Plate Detected");
  if (listing?.vin_label_detected) chips.push("VIN Label Detected");
  if (listing?.vin_text_detected) chips.push("VIN Text Detected");

  if (!chips.length) return <span className="muted">None</span>;

  return (
    <div className="chips">
      {chips.map((c) => (
        <span key={c} className="chip">{c}</span>
      ))}
    </div>
  );
}
