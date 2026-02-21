"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else router.push("/dashboard");
  }

  return (
    <main style={{height: "90vh", minHeight: "100vh", background: "#f8f6f1", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Georgia, serif" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <a href="/" className="navbar-logo" style={{ justifyContent: "center", display: "flex", marginBottom: "8px", fontFamily:"Poppins" }}>
         PricePulse
          </a>
          <span className="section-label">
            <span className="blue-line" />
            Create Your Account
          </span>
        </div>

        {/* Card */}
        <div className="step-card card-hover" style={{ padding: "52px 48px" }}>
          <h1 className="playfair" style={{ fontSize: "36px", fontWeight: 900, marginBottom: "8px", lineHeight: 1.1 }}>
            Start saving<br />
            <em style={{ color: "#2563eb", fontStyle: "italic" }}>money.</em>
          </h1>
          <p className="dm-sans" style={{ color: "#6b7280", marginBottom: "40px", fontSize: "15px" }}>
            Free forever. No credit card. Setup in 2 minutes.
          </p>

          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label className="dm-sans" style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{ width: "100%", border: "1.5px solid #e5e7eb", background: "#f8f6f1", padding: "14px 16px", fontSize: "15px", fontFamily: "DM Sans, sans-serif", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <div>
              <label className="dm-sans" style={{ fontSize: "11px", fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b7280", display: "block", marginBottom: "8px" }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                style={{ width: "100%", border: "1.5px solid #e5e7eb", background: "#f8f6f1", padding: "14px 16px", fontSize: "15px", fontFamily: "DM Sans, sans-serif", outline: "none", transition: "border-color 0.2s" }}
                onFocus={(e) => e.target.style.borderColor = "#2563eb"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "12px 16px" }}>
                <p style={{ color: "#dc2626", fontSize: "13px", margin: 0 }}>⚠ {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", textAlign: "center", marginTop: "8px", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Creating account..." : "Create Free Account →"}
            </button>
          </form>

          {/* Trust badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "32px", paddingTop: "32px", borderTop: "1px solid #e5e7eb" }}>
            {["✓ Free Forever", "✓ No Card", "✓ 2min Setup"].map((badge) => (
              <span key={badge} className="dm-sans" style={{ fontSize: "11px", letterSpacing: "0.1em", color: "#6b7280", textTransform: "uppercase" }}>
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Footer link */}
        <p className="dm-sans" style={{ textAlign: "center", marginTop: "28px", fontSize: "13px", color: "#6b7280" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none", letterSpacing: "0.05em" }}>
            Login →
          </Link>
        </p>
      </div>
    </main>
  );
}