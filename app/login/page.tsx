"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else router.push("/dashboard");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f8f6f1", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "Georgia, serif" }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <a href="/" className="navbar-logo" style={{ justifyContent: "center", display: "flex", marginBottom: "8px", fontFamily:"Poppins" }}>
             PricePulse
          </a>
          <span className="section-label">
            <span className="blue-line" />
            Welcome Back
          </span>
        </div>

        {/* Card */}
        <div className="step-card card-hover" style={{ padding: "52px 48px" }}>
          <h1 className="playfair" style={{ fontSize: "36px", fontWeight: 900, marginBottom: "8px", lineHeight: 1.1 }}>
            Sign back<br />
            <em style={{ color: "#2563eb", fontStyle: "italic" }}>in.</em>
          </h1>
          <p className="dm-sans" style={{ color: "#6b7280", marginBottom: "40px", fontSize: "15px" }}>
            Track your saved products and catch every deal.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
                placeholder="Your password"
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
              {loading ? "Signing in..." : "Login to Dashboard →"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="dm-sans" style={{ textAlign: "center", marginTop: "28px", fontSize: "13px", color: "#6b7280" }}>
          Don't have an account?{" "}
          <Link href="/register" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none", letterSpacing: "0.05em" }}>
            Register Free →
          </Link>
        </p>
      </div>
    </main>
  );
}