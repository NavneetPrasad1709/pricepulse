"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Result = {
  store: string;
  name: string;
  price: number;
  image: string;
  link: string;
  color: string;
  logo: string;
};

export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.push("/login");
      else {
        setUser(user);
        setLoading(false);
      }
    });
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearching(true);
    setResults([]);
    setSearched(false);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResults(data.products || []);
    } catch (err) {
      console.error(err);
    }
    setSearched(true);
    setSearching(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f6f1" }}>
        <p className="dm-sans" style={{ color: "#6b7280", letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "12px" }}>Loading...</p>
      </div>
    );
  }

  const BuyButton = ({ link, isPrimary }: { link: string; isPrimary: boolean }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" className={isPrimary ? "btn-primary" : "btn-outline"} style={{ fontSize: "12px", padding: "10px 22px", whiteSpace: "nowrap" }}>Buy Now</a>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8f6f1" }}>
      <nav className="navbar scrolled" style={{ position: "relative", padding: "20px 48px" }}>
        <a href="/" className="navbar-logo">PricePulse</a>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <span className="dm-sans" style={{ fontSize: "13px", color: "#6b7280" }}>{user?.email}</span>
          <button onClick={handleLogout} className="btn-outline" style={{ padding: "10px 24px", fontSize: "12px" }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 48px" }}>
        <div style={{ marginBottom: "48px" }}>
          <span className="section-label">
            <span className="blue-line" />
            Price Comparison
          </span>
          <h1 className="playfair" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 900, marginTop: "12px", lineHeight: 1.1 }}>
            Find the <em style={{ color: "#2563eb" }}>lowest price.</em>
          </h1>
          <p className="dm-sans" style={{ color: "#6b7280", marginTop: "16px", fontSize: "16px" }}>
            Type a product name or paste a URL — we compare prices across 5 stores instantly.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{ display: "flex", marginBottom: "48px" }}>
          <input
            type="text"
            required
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Try "iPhone 15" or "Nike Air Force 1"...'
            style={{ flex: 1, border: "1.5px solid #e5e7eb", borderRight: "none", background: "white", padding: "18px 24px", fontSize: "15px", fontFamily: "DM Sans, sans-serif", outline: "none" }}
          />
          <button type="submit" disabled={searching} className="btn-primary" style={{ padding: "18px 36px", fontSize: "13px", whiteSpace: "nowrap" }}>
            {searching ? "Searching..." : "Compare Prices"}
          </button>
        </form>

        {searching && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
            <p className="dm-sans" style={{ color: "#6b7280", fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Searching 5 stores...</p>
          </div>
        )}

        {searched && !searching && results.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>😕</div>
            <h2 className="playfair" style={{ fontSize: "28px", fontWeight: 700, marginBottom: "8px" }}>No results found</h2>
            <p className="dm-sans" style={{ color: "#6b7280" }}>Try a more specific product name.</p>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <span className="section-label" style={{ display: "block", marginBottom: "24px" }}>
              <span className="blue-line" />
              {results.length} stores found — sorted lowest first
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {results.map((result, i) => (
                <div key={result.store} style={{ background: "white", padding: "24px 32px", display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap", border: i === 0 ? "2px solid #2563eb" : "2px solid transparent", position: "relative" }}>
                  {i === 0 && (
                    <div style={{ position: "absolute", top: 0, right: 0, background: "#2563eb", color: "white", fontSize: "10px", fontFamily: "DM Sans, sans-serif", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", padding: "5px 14px" }}>
                      Best Price
                    </div>
                  )}
                  <div className="playfair" style={{ fontSize: "24px", fontWeight: 900, color: i === 0 ? "#2563eb" : "#d1d5db", minWidth: "40px" }}>
                    #{i + 1}
                  </div>
                  {result.image && (
                    <img src={result.image} alt={result.name} style={{ width: "56px", height: "56px", objectFit: "contain", flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: "160px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <span>{result.logo}</span>
                      <span className="dm-sans" style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: result.color }}>{result.store}</span>
                    </div>
                    <p className="dm-sans" style={{ fontSize: "13px", color: "#4b5563", margin: 0 }}>
                      {result.name.length > 55 ? result.name.slice(0, 55) + "..." : result.name}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "110px" }}>
                    <div className="playfair" style={{ fontSize: "28px", fontWeight: 900, color: i === 0 ? "#2563eb" : "#0a0a0a" }}>
                      Rs.{result.price.toLocaleString()}
                    </div>
                    {i > 0 && results[0] && (
                      <div className="dm-sans" style={{ fontSize: "11px", color: "#ef4444" }}>
                        +Rs.{(result.price - results[0].price).toLocaleString()} more
                      </div>
                    )}
                  </div>
                  <BuyButton link={result.link} isPrimary={i === 0} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
