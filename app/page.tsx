"use client";
import React, { useEffect, useState } from "react";
import Navbar from './Navbar'

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      setScrollY(window.scrollY);
    };
    const handleMouse = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  const marqueeItems = [
    "Amazon Tracking",
    "Flipkart Tracking",
    "Croma Prices",
    "Myntra Deals",
    "Instant Alerts",
    "Price Comparison",
    "Free Forever",
    "No Credit Card",
    "5 Stores at Once",
    "We Watch 24/7",
  ];

  const steps = [
    {
      n: "01",
      title: "Search Any Product",
      body: "Type a product name like 'iPhone 15' or paste a URL. We search Amazon, Flipkart, Croma, Myntra & Zara instantly.",
      icon: "🔍",
      dark: false,
    },
    {
      n: "02",
      title: "Compare All Prices",
      body: "See prices from all 5 stores side by side, ranked lowest to highest. Spot the best deal in seconds.",
      icon: "📊",
      dark: true,
    },
    {
      n: "03",
      title: "Buy or Track It",
      body: "Buy directly from the cheapest store, or save to your dashboard to track price drops over time.",
      icon: "🎯",
      dark: false,
    },
  ];

  return (
    <main>
      {/* Cursor Glow */}
      <div
        className="cursor-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      <Navbar />

      {/* ── HERO ── */}
      <section className="hero-section">
        {/* Ghost number background */}
        <div
          className="hero-number"
          style={{
            right: "2%",
            top: "8%",
            transform: `translateY(${scrollY * 0.15}px)`,
          }}
        >
          ₹
        </div>

        <div className="hero-content">
          <div
            className="fade-up"
            style={{ animationDelay: "0.1s", marginBottom: 24 }}
          >
            <span className="section-label">
              <span className="blue-line" />
              Price Intelligence Platform
            </span>
            <span className="section-label2">
              &nbsp;&nbsp;-By Navneet Prasad
            </span>
          </div>

          <h1
            className="big-headline fade-up"
            style={{ animationDelay: "0.25s", marginBottom: 32 }}
          >
            Stop Paying
            <br />
            <em style={{ color: "#2563eb", fontStyle: "italic" }}>
              Full Price.
            </em>
            <br />
            <span style={{ color: "#374151" }}>Ever Again.</span>
          </h1>

          <p
            className="dm-sans fade-up"
            style={{
              fontFamily: "DM Sans, sans-serif",
              animationDelay: "0.4s",
              fontSize: "18px",
              lineHeight: 1.7,
              color: "#6b7280",
              maxWidth: "520px",
              marginBottom: "48px",
            }}
          >
            PricePulse compares prices across{" "}
            <span style={{ fontWeight: 600, fontSize: "19px", color: "#2563eb" }}>Amazon</span>,{" "}
            <span style={{ fontWeight: 600, fontSize: "19px", color: "#2563eb" }}>Flipkart</span>,{" "}
            <span style={{ fontWeight: 600, fontSize: "19px", color: "#2563eb" }}>Croma</span>,{" "}
            <span style={{ fontWeight: 600, fontSize: "19px", color: "#2563eb" }}>Myntra</span>{" "}
            &{" "}
            <span style={{ fontWeight: 600, fontSize: "19px", color: "#2563eb" }}>Zara</span>{" "}
            instantly. Find the lowest price in seconds. Simple, powerful, free.
          </p>

          <div
            className="hero-cta-row fade-up"
            style={{ animationDelay: "0.55s" }}
          >
            <a href="/compare" className="btn-primary">
              Compare Prices Free →
            </a>
            <a href="#how" className="btn-outline">
              See How It Works
            </a>
          </div>

          <div className="stats-row fade-up" style={{ animationDelay: "0.7s" }}>
            <div>
              <div className="stat-big">5</div>
              <div className="section-label" style={{ marginTop: 6 }}>
                Stores compared
              </div>
            </div>
            <div className="stats-divider" />
            <div>
              <div className="stat-big">₹12K</div>
              <div className="section-label" style={{ marginTop: 6 }}>
                Avg. savings per user
              </div>
            </div>
            <div className="stats-divider" />
            <div>
              <div className="stat-big">2min</div>
              <div className="section-label" style={{ marginTop: 6 }}>
                Setup time
              </div>
            </div>
          </div>
        </div>

        <div className="scroll-indicator">
          <div className="scroll-line" />
          <span className="section-label">Scroll to explore</span>
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} style={{ display: "flex" }}>
              {marqueeItems.map((text, j) => (
                <span key={j} className="marquee-item">
                  {text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="how-section">
        <div className="how-inner">
          <div className="how-header">
            <span className="section-label">
              <span className="blue-line" />
              The Process
            </span>
            <h2 className="section-heading">
              Three steps.
              <br />
              <em style={{ color: "#2563eb" }}>Zero effort.</em>
            </h2>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`step-card card-hover ${step.dark ? "dark" : ""}`}
              >
                <div className={`feature-number ${step.dark ? "dark" : ""}`}>
                  {step.n}
                </div>
                <div style={{ fontSize: 32, marginBottom: 20 }}>
                  {step.icon}
                </div>
                <h3
                  className="playfair"
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    marginBottom: 16,
                    color: step.dark ? "white" : "#0a0a0a",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="dm-sans"
                  style={{
                    fontSize: 15,
                    lineHeight: 1.8,
                    color: step.dark ? "#9ca3af" : "#6b7280",
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ── STORE LOGOS STRIP ── */}
      <section style={{ padding: "60px 48px", background: "white", textAlign: "center" }}>
        <span className="section-label" style={{ display: "block", marginBottom: "32px" }}>
          <span className="blue-line" />
          We compare prices across
        </span>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "48px", flexWrap: "wrap" }}>
          {[
            { name: "Amazon.in", color: "#FF9900", logo: "🛒" },
            { name: "Flipkart", color: "#2874F0", logo: "🏪" },
            { name: "Croma", color: "#1A8B3E", logo: "🔌" },
            { name: "Myntra", color: "#FF3F6C", logo: "👗" },
            { name: "Zara", color: "#000000", logo: "🧥" },
          ].map((store) => (
            <div key={store.name} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{store.logo}</div>
              <div className="dm-sans" style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: store.color }}>
                {store.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="divider" />

      {/* ── CTA BAND ── */}
      <section className="cta-band">
        <div className="hero-number light" style={{ left: "5%" }}>
          $
        </div>
        <div
          className="hero-number light"
          style={{ right: "5%", bottom: "10%" }}
        >
          ₹
        </div>
        <div className="cta-inner">
          <span className="section-label light">
            <span className="blue-line" />
            Ready to save?
          </span>
          <h2 className="cta-headline">
            Your next deal
            <br />
            <em style={{ color: "#2563eb" }}>is waiting.</em>
          </h2>
          <p className="cta-sub">
            Join thousands of smart shoppers already saving money with
            PricePulse.
          </p>
          <a href="/compare" className="btn-primary large">
            Compare Prices for Free →
          </a>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-logo">
          <span></span>
          <span>PricePulse</span>
        </div>
        <p className="footer-copy">
          © 2026 PricePulse - By Navneet Prasad. 💸
        </p>
        <div className="footer-links">
          <a href="/compare" className="footer-link">Compare</a>
          <a href="/dashboard" className="footer-link">Dashboard</a>
          <a href="/login" className="footer-link">Login</a>
          <a href="/register" className="footer-link">Register</a>
        </div>
      </footer>
    </main>
  );
};

export default Home;