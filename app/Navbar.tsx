'use client'
import React, { useEffect, useState } from 'react'
import "./navbar.css"
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>

        {/* Logo */}
        <a href="/" className="navbar-logo">
          <span></span>
          <span>PricePulse</span>
        </a>

        {/* Desktop Links */}
        <div className="navbar-links desktop-links">
          <a href="#how"      className="nav-link">How it works</a>
          <a href="/login"    className="nav-link">Login</a>
          <a href="/register" className="btn-primary">Get Started</a>
        </div>

        {/* Hamburger — mobile only */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

      </nav>

      {/* ── MOBILE OVERLAY (backdrop) ── */}
      <div
        className={`sidebar-overlay ${menuOpen ? 'visible' : ''}`}
        onClick={closeMenu}
      />

      {/* ── MOBILE SIDEBAR ── */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>

        {/* Sidebar Header */}
        <div className="sidebar-header">
          <a href="/" className="navbar-logo" onClick={closeMenu}>
            <span></span>
            <span>PricePulse</span>
          </a>
          <button className="sidebar-close" onClick={closeMenu} aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="sidebar-nav">
          <a href="#how"      className="sidebar-link" onClick={closeMenu}>
            <span className="sidebar-link-num">01</span>
            How it works
          </a>
          <a href="/login"    className="sidebar-link" onClick={closeMenu}>
            <span className="sidebar-link-num">03</span>
            Login
          </a>
        </nav>

        {/* Sidebar CTA */}
        <div className="sidebar-footer">
          <a href="/register" className="btn-primary sidebar-btn" onClick={closeMenu}>
            Get Started Free →
          </a>
          <p className="sidebar-tagline">No credit card required.</p>
        </div>

      </aside>
    </>
  )
}

export default Navbar
