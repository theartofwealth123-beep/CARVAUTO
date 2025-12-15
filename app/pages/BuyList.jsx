cat > app/src/pages/BuyList.jsx <<'EOF'
import React, { useEffect, useState } from "react";
import Filters from "../components/Filters.jsx";
import ListingsTable from "../components/ListingsTable.jsx";
import { searchListings } from "../src/api.js";

export default function BuyList() {
  const [filters, setFilters] = useState({
    market_id: "",
    min_score: "60",
    min_price: "",
    max_price: "",
    min_miles: "",
    max_miles: "",
    include_unknown: "false",
    include_risk: "false"
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");

  async function runSearch() {
    setLoading(true);
    setError("");
    try {
      const res = await searchListings(filters);
      setListings(res.data || []);
    } catch (e) {
      setError(e.message || "Search failed");
      setListings([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid" style={{ gap: 12 }}>
      <Filters value={filters} onChange={setFilters} onApply={runSearch} loading={loading} />
      {error ? <div className="card" style={{ borderColor: "#f0caca" }}>{error}</div> : null}
      <ListingsTable listings={listings} />
    </div>
  );
}
EOF
