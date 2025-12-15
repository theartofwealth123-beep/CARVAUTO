import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./styles.css";
import BuyList from "./pages/BuyList.jsx";
import ListingDetail from "./pages/ListingDetail.jsx";

function AppShell() {
  return (
    <>
      <div className="topbar">
        <div className="brand">
          <Link to="/" style={{ textDecoration: "none" }}>Carvauto</Link>
        </div>
        <div className="muted" style={{ fontSize: 13 }}>
          Clean-title buy list + VIN/plate signals
        </div>
      </div>
      <div className="container">
        <Routes>
          <Route path="/" element={<BuyList />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
        </Routes>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </React.StrictMode>
);
