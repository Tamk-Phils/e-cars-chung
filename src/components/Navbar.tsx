import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore, type Currency } from '../context/StoreContext';
import {
  Heart,
  Scale,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Flame,
  ShieldCheck,
  FileText,
  DollarSign,
  Lock,
  Package,
  Phone,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    wishlist,
    compareList,
    orders,
    vehicles,
    setIsCompareOpen,
    setIsWishlistOpen,
    currency,
    setCurrency,
    theme,
    toggleTheme,
    setFilters,
  } = useStore();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);

  const handleConditionNav = (condition: string) => {
    setBuyDropdownOpen(false);
    setMobileMenuOpen(false);
    setFilters(prev => ({ ...prev, condition }));
    navigate(`/inventory?condition=${encodeURIComponent(condition)}`);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Left: Cars.com Iconic Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', textDecoration: 'none' }}
          >
            {/* Iconic Purple Oval Badge for cars.com */}
            <div
              style={{
                background: 'var(--accent-purple)',
                color: '#ffffff',
                padding: '5px 16px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(116, 39, 199, 0.2)',
              }}
            >
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.04em', fontStyle: 'italic', fontFamily: 'sans-serif' }}>
                cars<span style={{ fontSize: '1.1rem', fontStyle: 'normal' }}>.com</span>
              </span>
            </div>
          </Link>

          {/* Center Navigation Links: Buy, Sell, Research, Finance, Reviews, Track */}
          <nav style={{ display: 'none', alignItems: 'center', gap: '22px' }} className="desktop-nav">
            {/* Buy Menu with Submenu */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setBuyDropdownOpen(true)}
              onMouseLeave={() => setBuyDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  setFilters(prev => ({ ...prev, condition: 'all' }));
                  navigate('/inventory');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                  color: isActive('/inventory') ? 'var(--accent-purple)' : '#111827',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: '8px 0',
                }}
              >
                Buy <ChevronDown size={14} style={{ color: '#6b7280' }} />
              </button>

              {buyDropdownOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    width: '260px',
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    padding: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 150,
                  }}
                >
                  <button
                    onClick={() => {
                      setBuyDropdownOpen(false);
                      setFilters(prev => ({ ...prev, condition: 'all' }));
                      navigate('/inventory');
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    All Vehicles ({vehicles.length})
                  </button>
                  <button
                    onClick={() => handleConditionNav('Brand New')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-purple)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#ede9fe')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Sparkles size={15} /> Brand New 2026 Models
                  </button>
                  <button
                    onClick={() => handleConditionNav('Used')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', fontWeight: 500 }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <ShieldCheck size={15} style={{ color: '#059669' }} /> Certified Pre-Owned & Used
                  </button>
                  <button
                    onClick={() => handleConditionNav('Bank Seized / Repo')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600, color: '#e11d48' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#ffe4e6')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Flame size={15} /> Bank Repos & Liquidation
                  </button>
                </div>
              )}
            </div>

            {/* Sell Link */}
            <Link
              to="/sell"
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isActive('/sell') ? 'var(--accent-purple)' : '#111827',
                textDecoration: 'none',
              }}
            >
              Sell & Trade-In
            </Link>

            {/* Research */}
            <Link
              to="/research"
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isActive('/research') ? 'var(--accent-purple)' : '#111827',
                textDecoration: 'none',
              }}
            >
              Research & Guides
            </Link>

            {/* Finance Link */}
            <Link
              to="/finance"
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isActive('/finance') ? 'var(--accent-purple)' : '#111827',
                textDecoration: 'none',
              }}
            >
              Financing
            </Link>

            {/* Reviews */}
            <Link
              to="/reviews"
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isActive('/reviews') ? 'var(--accent-purple)' : '#111827',
                textDecoration: 'none',
              }}
            >
              Reviews
            </Link>

            {/* Track Orders */}
            <Link
              to="/orders"
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isActive('/orders') ? 'var(--accent-purple)' : '#111827',
                textDecoration: 'none',
              }}
            >
              Track Order
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              style={{
                fontSize: '0.92rem',
                fontWeight: 600,
                color: isActive('/contact') ? 'var(--accent-purple)' : '#111827',
                textDecoration: 'none',
              }}
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Side: Currency, Saved, Compare, Admin */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Currency Switcher */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value as Currency)}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: '#f9fafb',
                color: '#111827',
                cursor: 'pointer',
              }}
              title="Select Currency"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
            </select>
          </div>

          {/* Saved Items */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            title="Saved Cars"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#111827',
              position: 'relative',
            }}
          >
            <Heart size={18} fill={wishlist.length > 0 ? '#ef4444' : 'none'} color={wishlist.length > 0 ? '#ef4444' : 'currentColor'} />
            <span style={{ display: 'none' }} className="desk-only">Saved</span>
            {wishlist.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-6px',
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

          {/* Compare */}
          <button
            onClick={() => setIsCompareOpen(true)}
            title="Compare Vehicles"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#111827',
              position: 'relative',
            }}
          >
            <Scale size={18} color={compareList.length > 0 ? 'var(--accent-purple)' : 'currentColor'} />
            <span style={{ display: 'none' }} className="desk-only">Compare</span>
            {compareList.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-5px',
                  right: '-6px',
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

          {/* Admin Control Portal */}
          <Link
            to="/admin"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: '#f3f4f6',
              border: '1px solid #e5e7eb',
              color: '#374151',
              fontWeight: 700,
              fontSize: '0.8rem',
              textDecoration: 'none',
            }}
          >
            <Lock size={13} style={{ color: 'var(--accent-purple)' }} />
            <span>Admin</span>
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{ background: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Link
            to="/inventory"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', textDecoration: 'none', padding: '8px 0' }}
          >
            Shop All Vehicles ({vehicles.length})
          </Link>
          <button
            onClick={() => handleConditionNav('Brand New')}
            style={{ background: 'transparent', border: 'none', textAlign: 'left', fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-purple)', padding: '6px 0', cursor: 'pointer' }}
          >
            ★ Brand New 2026 Models
          </button>
          <button
            onClick={() => handleConditionNav('Used')}
            style={{ background: 'transparent', border: 'none', textAlign: 'left', fontSize: '0.95rem', fontWeight: 600, color: '#059669', padding: '6px 0', cursor: 'pointer' }}
          >
            🛡 Certified Pre-Owned
          </button>
          <button
            onClick={() => handleConditionNav('Bank Seized / Repo')}
            style={{ background: 'transparent', border: 'none', textAlign: 'left', fontSize: '0.95rem', fontWeight: 600, color: '#e11d48', padding: '6px 0', cursor: 'pointer' }}
          >
            🔥 Bank Repos & Liquidation
          </button>
          <Link
            to="/sell"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', textDecoration: 'none', padding: '8px 0' }}
          >
            Sell or Trade-In Your Car
          </Link>
          <Link
            to="/finance"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', textDecoration: 'none', padding: '8px 0' }}
          >
            Auto Financing Calculator
          </Link>
          <Link
            to="/research"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', textDecoration: 'none', padding: '8px 0' }}
          >
            Buyer Guides & Research
          </Link>
          <Link
            to="/reviews"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', textDecoration: 'none', padding: '8px 0' }}
          >
            Customer Reviews
          </Link>
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', textDecoration: 'none', padding: '8px 0' }}
          >
            Track Order Status
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', textDecoration: 'none', padding: '8px 0' }}
          >
            Showroom & Support
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent-purple)', textDecoration: 'none', padding: '8px 0' }}
          >
            Admin Management Console
          </Link>
        </div>
      )}
    </header>
  );
};
