"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";

type Result = {
  store: string;
  name: string;
  price: number;
  image: string;
  link: string;
  color: string;
  logo: string;
};

export default function ComparePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const supabase = createClient();

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSearched(false);
    setResults([]);
    const res = await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    setResults(data.products || []);
    setLoading(false);
    setSearched(true);
  }

  async function handleSave(result: Result) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { window.location.href = "/login"; return; }
    const { data } = await supabase.from("tracked_products").insert({
      user_id: user.id,
      url: result.link,
      product_name: result.name,
      current_price: result.price,
      target_price: result.price,
      image_url: result.image,
      last_checked: new Date().toISOString(),
    }).select().single();
    if (data) setSavedId(result.link);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8f6f1" }}>

      {/* Navbar */}
      <nav className="navbar scrolled" style={{ position: "relative", padding: "20px 48px" }}>
        <a href="/" className="navbar-logo">📉 PricePulse</a>
        <div style={{ display: "flex", gap: "24px" }}>
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/login" className="btn-primary" style={{ padding: "10px 24px", fontSize: "12px" }}>Login</a>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 48px" }}>

        {/* Header */}
        <div style={{ marginBottom: "48px" }}>
          <span className="section-label"><span className="blue-line" />Price Comparison</span>
          <h1 className="playfair" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, marginTop: "12px", lineHeight: 1.1 }}>
            Find the <em style={{ color: "#2563eb" }}>lowest price.</em>
          </h1>
          <p className="dm-sans" style={{ color: "#6b7280", marginTop: "16px", fontSize: "16px" }}>
            Search any product — we'll find the best price across Amazon, Flipkart, Croma, Myntra & Zara instantly.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0", marginBottom: "60px" }}>
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "iPhone 15" or "Nike shoes" or paste a URL...'
            style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRight: "none", background: "white", padding: "18px 24px", fontSize: "16px", fontFamily: "DM Sans, sans-serif", outline: "none" }}
            onFocus={(e) => e.target.style.borderColor = "#2563eb"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
          <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "18px 36px", fontSize: "14px", whiteSpace: "nowrap" }}>
            {loading ? "Searching..." : "Compare Prices →"}
          </button>
        </form>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p className="dm-sans" style={{ color: "#6b7280", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "12px" }}>
              Searching across 5 stores...
            </p>
          </div>
        )}

        {/* Results */}
        {searched && results.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>😕</div>
            <h2 className="playfair" style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>No results found</h2>
            <p className="dm-sans" style={{ color: "#6b7280" }}>Try a different product name or be more specific.</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <span className="section-label"><span className="blue-line" />{results.length} stores found</span>
              <span className="dm-sans" style={{ fontSize: "12px", color: "#6b7280", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Sorted: lowest first
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {results.map((result, i) => (
                <div key={result.store} className="step-card card-hover" style={{ padding: "28px 36px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>

                  {/* Rank badge */}
                  <div style={{ minWidth: "48px", textAlign: "center" }}>
                    {i === 0 ? (
                      <div style={{ background: "#2563eb", color: "white", fontFamily: "Playfair Display, serif", fontWeight: 900, fontSize: "18px", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        #1
                      </div>
                    ) : (
                      <div className="playfair" style={{ fontSize: "24px", fontWeight: 900, color: "#d1d5db" }}>#{i + 1}</div>
                    )}
                  </div>

                  {/* Product image */}
                  {result.image && (
                    <img src={result.image} alt={result.name} style={{ width: "64px", height: "64px", objectFit: "contain", background: "#f8f6f1" }} />
                  )}

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "18px" }}>{result.logo}</span>
                      <span className="dm-sans" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: result.color }}>
                        {result.store}
                      </span>
                      {i === 0 && (
                        <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", fontSize: "10px", fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "2px 8px" }}>
                          Best Price
                        </span>
                      )}
                    </div>
                    <p className="dm-sans" style={{ fontSize: "14px", color: "#4b5563", margin: 0, lineHeight: 1.4 }}>
                      {result.name.length > 60 ? result.name.substring(0, 60) + "..." : result.name}
                    </p>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: "right", minWidth: "120px" }}>
                    <div className="playfair" style={{ fontSize: "32px", fontWeight: 900, color: i === 0 ? "#2563eb" : "#0a0a0a", lineHeight: 1 }}>
                      ₹{result.price.toLocaleString()}
                    </div>
                    {i > 0 && results[0] && (
                      <div className="dm-sans" style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>
                        +₹{(result.price - results[0].price).toLocaleString()} more
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "140px" }}>
                    <a href={result.link} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: "11px", padding: "10px 20px", textAlign: "center" }}>
                      Buy Now →
                    </a>
                    <button
                      onClick={() => handleSave(result)}
                      disabled={savedId === result.link}
                      className="btn-outline"
                      style={{ fontSize: "11px", padding: "9px 20px", opacity: savedId === result.link ? 0.5 : 1 }}
                    >
                      {savedId === result.link ? "✓ Saved" : "+ Save to Dashboard"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}