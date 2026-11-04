import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { Currency } from '../types';
import {
  Car,
  Heart,
  Scale,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  PhoneCall,
  Clock,
  Truck,
  Sparkles,
  Flame,
  Search,
  Lock,
  Compass,
  DollarSign,
  FileText,
  Star,
  MapPin,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    wishlist,
    compareList,
    vehicles,
    setIsCompareOpen,
    setIsWishlistOpen,
    currency,
    setCurrency,
    setFilters,
  } = useStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(false);

  const handleCategoryNav = (filterUpdate: Record<string, any>) => {
    setInventoryDropdownOpen(false);
    setMobileMenuOpen(false);
    setFilters(prev => ({ ...prev, ...filterUpdate }));
    navigate('/inventory');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000, background: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' }}>
      {/* ─── 1. TOP UTILITY BAR (Executive Dealership Bar) ─────────────────────────── */}
      <div
        className="top-utility-bar"
        style={{
          background: '#0f172a',
          color: '#cbd5e1',
          fontSize: '0.78rem',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '6px 0',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Contact & Showroom Hours */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <a
              href="tel:8008452886"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ffffff',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <PhoneCall size={13} style={{ color: '#38bdf8' }} />
              <span>(800) 845-2886</span>
            </a>
            <span style={{ display: 'none', alignItems: 'center', gap: '5px' }} className="top-hours">
              <Clock size={12} style={{ color: '#94a3b8' }} />
              Mon–Sat: 8:30 AM – 7:30 PM EST
            </span>
            <span style={{ display: 'none', alignItems: 'center', gap: '5px' }} className="top-delivery">
              <Truck size={12} style={{ color: '#34d399' }} />
              Nationwide Enclosed Delivery Available
            </span>
          </div>

          {/* Right: Guarantee, Currency, Track, Admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#10b981', fontWeight: 600 }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span>150-Pt Inspected</span>
            </div>

            {/* Currency Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value as Currency)}
                style={{
                  background: '#1e293b',
                  color: '#f8fafc',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none',
                }}
                title="Select Display Currency"
              >
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
              </select>
            </div>

            {/* Track Orders Link */}
            <Link
              to="/orders"
              style={{
                color: '#cbd5e1',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                display: 'none',
              }}
              className="top-track-link"
            >
              Track Order
            </Link>

            {/* Admin Link */}
            <Link
              to="/admin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#cbd5e1',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.75rem',
                background: 'rgba(255,255,255,0.08)',
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              <Lock size={11} style={{ color: '#a78bfa' }} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 2. MAIN NAVIGATION BAR ──────────────────────────────────────────────── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
          {/* Dealership Logo & Brand Monogram */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7427c7 0%, #431407 100%, #1e1b4b 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(116, 39, 199, 0.3)',
                flexShrink: 0,
              }}
            >
              <Car size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)' }}>
                  CHUNG <span style={{ color: 'var(--accent-purple)' }}>MOTORS</span>
                </span>
                <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', border: '1px solid #a7f3d0' }}>
                  CERTIFIED
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Direct Automotive Exchange • {vehicles.length} Units In Stock
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '26px' }} className="desktop-nav">
            {/* Inventory Menu with Dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setInventoryDropdownOpen(true)}
              onMouseLeave={() => setInventoryDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, condition: 'all', make: 'all', bodyType: 'all', onlyHotDeals: false }));
                  navigate('/inventory');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: isActive('/inventory') ? 'var(--accent-purple)' : '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  padding: '10px 0',
                }}
              >
                <span>Inventory</span>
                <span
                  style={{
                    background: 'var(--accent-purple-light)',
                    color: 'var(--accent-purple)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '10px',
                  }}
                >
                  {vehicles.length}
                </span>
                <ChevronDown size={14} style={{ color: '#94a3b8' }} />
              </button>

              {/* Hover Mega Dropdown */}
              {inventoryDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '320px',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 16px 36px rgba(0,0,0,0.12)',
                    padding: '14px',
                    zIndex: 200,
                  }}
                >
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '8px' }}>
                    Browse By Category
                  </div>
                  <button
                    onClick={() => handleCategoryNav({ condition: 'all', bodyType: 'all', onlyHotDeals: false })}
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e293b' }}>All In-Stock Inventory</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{vehicles.length} cars</span>
                  </button>
                  <button
                    onClick={() => handleCategoryNav({ onlyHotDeals: true })}
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Flame size={14} /> Hot Deals Under $8k
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#e11d48', fontWeight: 700 }}>
                      {vehicles.filter(v => v.price <= 8000).length} cars
                    </span>
                  </button>
                  <button
                    onClick={() => handleCategoryNav({ bodyType: 'Sedan' })}
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Sedans & Commuters</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{vehicles.filter(v => v.body_type === 'Sedan').length}</span>
                  </button>
                  <button
                    onClick={() => handleCategoryNav({ bodyType: 'SUV' })}
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>SUVs & Crossovers</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{vehicles.filter(v => v.body_type === 'SUV').length}</span>
                  </button>
                  <button
                    onClick={() => handleCategoryNav({ bodyType: 'Truck' })}
                    style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: '#334155' }}>Trucks & Heavy Duty</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{vehicles.filter(v => v.body_type === 'Truck').length}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Sell / Trade-In */}
            <Link
              to="/sell"
              style={{
                fontSize: '0.94rem',
                fontWeight: 700,
                color: isActive('/sell') ? 'var(--accent-purple)' : '#1e293b',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>Sell & Trade</span>
              <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                Instant Offer
              </span>
            </Link>

            {/* Financing */}
            <Link
              to="/finance"
              style={{
                fontSize: '0.94rem',
                fontWeight: 700,
                color: isActive('/finance') ? 'var(--accent-purple)' : '#1e293b',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span>Financing</span>
              <span style={{ background: '#ede9fe', color: 'var(--accent-purple)', fontSize: '0.65rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px' }}>
                Low APR
              </span>
            </Link>

            {/* Research */}
            <Link
              to="/research"
              style={{
                fontSize: '0.94rem',
                fontWeight: 700,
                color: isActive('/research') ? 'var(--accent-purple)' : '#1e293b',
                textDecoration: 'none',
              }}
            >
              Buyer Guides
            </Link>

            {/* Reviews */}
            <Link
              to="/reviews"
              style={{
                fontSize: '0.94rem',
                fontWeight: 700,
                color: isActive('/reviews') ? 'var(--accent-purple)' : '#1e293b',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>Reviews</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#f59e0b', fontSize: '0.75rem', fontWeight: 800 }}>
                <Star size={11} fill="#f59e0b" /> 4.9
              </span>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              style={{
                fontSize: '0.94rem',
                fontWeight: 700,
                color: isActive('/contact') ? 'var(--accent-purple)' : '#1e293b',
                textDecoration: 'none',
              }}
            >
              Showroom
            </Link>
          </nav>

          {/* Right Header Controls: Saved, Compare, CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Wishlist Heart */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              title="Saved Vehicles"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Heart size={18} fill={wishlist.length > 0 ? '#ef4444' : 'none'} color={wishlist.length > 0 ? '#ef4444' : '#475569'} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Compare Scale */}
            <button
              onClick={() => setIsCompareOpen(true)}
              title="Compare Vehicles"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Scale size={18} color={compareList.length > 0 ? 'var(--accent-purple)' : '#475569'} />
              {compareList.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    background: 'var(--accent-purple)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Primary Browse Inventory Button */}
            <Link
              to="/inventory"
              className="btn btn-primary nav-browse-btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Search size={14} />
              <span>Browse All ({vehicles.length})</span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="mobile-menu-btn"
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 3. MOBILE SLIDE-DOWN DRAWER ─────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            padding: '16px 20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxHeight: '82vh',
            overflowY: 'auto',
          }}
        >
          {/* Quick Call Button on Mobile */}
          <a
            href="tel:8008452886"
            style={{
              background: '#0f172a',
              color: '#ffffff',
              padding: '12px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 800,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            <PhoneCall size={16} style={{ color: '#38bdf8' }} />
            <span>Call Showroom: (800) 845-2886</span>
          </a>

          {/* Quick Category Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '6px' }}>
            <button
              onClick={() => handleCategoryNav({ condition: 'all', onlyHotDeals: false, bodyType: 'all' })}
              style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}
            >
              🚗 All Cars ({vehicles.length})
            </button>
            <button
              onClick={() => handleCategoryNav({ onlyHotDeals: true })}
              style={{ padding: '10px', background: '#fef2f2', border: '1px solid #fecdd3', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', color: '#e11d48' }}
            >
              🔥 Hot Deals Under $8k
            </button>
            <button
              onClick={() => handleCategoryNav({ bodyType: 'SUV' })}
              style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}
            >
              🚙 SUVs & Crossovers
            </button>
            <button
              onClick={() => handleCategoryNav({ bodyType: 'Sedan' })}
              style={{ padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', textAlign: 'left', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}
            >
              🏎️ Sedans & Coupes
            </button>
          </div>

          <div style={{ height: '1px', background: '#e2e8f0', margin: '4px 0' }}></div>

          {/* Core Page Links */}
          <Link
            to="/inventory"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', textDecoration: 'none', padding: '6px 0' }}
          >
            Full Vehicle Inventory ({vehicles.length})
          </Link>
          <Link
            to="/sell"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', textDecoration: 'none', padding: '6px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>Sell & Trade-In Appraisal</span>
            <span style={{ fontSize: '0.7rem', color: '#059669', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>Instant Cash</span>
          </Link>
          <Link
            to="/finance"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', textDecoration: 'none', padding: '6px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>Auto Loan Calculator & Pre-Qualify</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', background: '#ede9fe', padding: '2px 6px', borderRadius: '4px' }}>From 4.9%</span>
          </Link>
          <Link
            to="/research"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', textDecoration: 'none', padding: '6px 0' }}
          >
            Car Buying Guides & Tips
          </Link>
          <Link
            to="/reviews"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', textDecoration: 'none', padding: '6px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>Customer Testimonials</span>
            <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 800 }}>★ 4.9 Rating</span>
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', textDecoration: 'none', padding: '6px 0' }}
          >
            Track Existing Reservation
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', textDecoration: 'none', padding: '6px 0' }}
          >
            Showroom Hours & Directions
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '0.9rem', fontWeight: 700, color: '#7c3aed', textDecoration: 'none', padding: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Lock size={14} /> Staff Admin Dashboard
          </Link>

          {/* Currency selection on mobile */}
          <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Currency:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['USD', 'EUR', 'GBP'] as Currency[]).map(cur => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: currency === cur ? 'var(--accent-purple)' : '#f8fafc',
                    color: currency === cur ? '#fff' : '#1e293b',
                    cursor: 'pointer',
                  }}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
