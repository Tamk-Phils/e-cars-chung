import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { Currency } from '../types';
import {
  Flame,
  Heart,
  Scale,
  Menu,
  X,
  Lock,
  PhoneCall,
  Mail,
  ChevronRight,
  User as UserIcon,
  MessageCircle,
  LogOut,
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
    currentUser,
    openLoginModal,
    logoutUser,
    setIsChatOpen,
  } = useStore();

  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Inventory', path: '/inventory', count: vehicles.length },
    { label: 'Financing', path: '/finance' },
    { label: 'Sell / Trade', path: '/sell' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: '14px',
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 16px',
        pointerEvents: 'none',
      }}
    >
      {/* ─── FLOATING PILL NAVBAR CONTAINER ─────────────────────────── */}
      <nav
        style={{
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#09090b',
          borderRadius: '9999px',
          padding: '8px 12px 8px 8px',
          width: '100%',
          maxWidth: '1180px',
          boxShadow: '0 16px 36px -6px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Left: Circular White Disc with Blue Flame Icon + Brand Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link
            to="/"
            title="Chung Motors Certified"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: '12px',
            }}
          >
            {/* Circular White Disc with Blue Flame matching reference */}
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
                flexShrink: 0,
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Flame size={22} fill="#2563eb" color="#2563eb" />
            </div>

            <span
              style={{
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.05rem',
                letterSpacing: '-0.025em',
                fontFamily: 'var(--font-heading)',
                whiteSpace: 'nowrap',
              }}
            >
              Chung Motors
            </span>
          </Link>
        </div>

        {/* Center: Clean Minimalist Nav Links (Desktop) */}
        <div
          className="desktop-nav"
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {navLinks.map(link => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: active ? '#ffffff' : '#9ca3af',
                  fontSize: '0.92rem',
                  fontWeight: active ? 700 : 500,
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  background: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  }
                }}
                onMouseLeave={e => {
                  if (!active) {
                    e.currentTarget.style.color = '#9ca3af';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span>{link.label}</span>
                {link.count !== undefined && (
                  <span
                    style={{
                      background: active ? '#ffffff' : 'rgba(255, 255, 255, 0.16)',
                      color: active ? '#09090b' : '#cbd5e1',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '9999px',
                    }}
                  >
                    {link.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Right: Utility Buttons & Signature White Pill Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Wishlist Button (Desktop) */}
          <button
            onClick={() => setIsWishlistOpen(true)}
            title="Saved Vehicles"
            className="desk-only"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              color: wishlist.length > 0 ? '#ef4444' : '#cbd5e1',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
          >
            <Heart size={16} fill={wishlist.length > 0 ? '#ef4444' : 'none'} />
            {wishlist.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '15px',
                  height: '15px',
                  fontSize: '0.62rem',
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

          {/* Compare Button (Desktop) */}
          <button
            onClick={() => setIsCompareOpen(true)}
            title="Compare Vehicles"
            className="desk-only"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              color: compareList.length > 0 ? '#a855f7' : '#cbd5e1',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
          >
            <Scale size={16} />
            {compareList.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  background: '#a855f7',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '15px',
                  height: '15px',
                  fontSize: '0.62rem',
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

          {/* User Sign In / Account Dropdown */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsChatOpen(true)}
                title="Open Live Concierge Chat"
                style={{
                  background: 'rgba(37, 99, 235, 0.25)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '9999px',
                  padding: '7px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <MessageCircle size={14} color="#60a5fa" />
                <span className="desk-only">Live Chat</span>
              </button>

              <button
                onClick={logoutUser}
                title={`Signed in as ${currentUser.name} (${currentUser.email}). Click to sign out.`}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '7px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#ffffff',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <UserIcon size={14} color="#10b981" />
                <span className="desk-only">{currentUser.name.split(' ')[0]}</span>
                <LogOut size={12} color="#94a3b8" />
              </button>
            </div>
          ) : (
            <button
              onClick={openLoginModal}
              title="Sign in or create account to live chat with admin"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                borderRadius: '9999px',
                padding: '7px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
            >
              <UserIcon size={14} color="#60a5fa" />
              <span className="desk-only">Sign In</span>
            </button>
          )}

          {/* Admin Link (Desktop Only) */}
          <Link
            to="/admin"
            title="Staff Admin Portal"
            className="desk-only"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#cbd5e1',
              textDecoration: 'none',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)')}
          >
            <Lock size={15} />
          </Link>

          {/* Signature White Capsule Button (Matching Reference) */}
          <Link
            to="/contact"
            title="Contact Sales Team"
            style={{
              background: '#ffffff',
              color: '#09090b',
              borderRadius: '9999px',
              padding: '9px 20px',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Mail size={14} style={{ color: '#2563eb' }} />
            <span className="desk-only">sales@chungmotors.com</span>
            <span className="mobile-only">Contact</span>
          </Link>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="mobile-menu-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              color: '#ffffff',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* ─── MOBILE SLIDE-DOWN CAPSULE DRAWER ─────────────────────────── */}
      {mobileMenuOpen && (
        <div
          style={{
            pointerEvents: 'auto',
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            width: '100%',
            maxWidth: '1180px',
            marginTop: '8px',
            maxHeight: '80vh',
            overflowY: 'auto',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Direct Phone Call Button */}
          <a
            href="tel:8008452886"
            style={{
              background: '#2563eb',
              color: '#ffffff',
              padding: '12px 18px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              marginBottom: '6px',
            }}
          >
            <PhoneCall size={16} />
            <span>Call Showroom: (800) 845-2886</span>
          </a>

          {/* Nav Links */}
          {navLinks.map(link => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  color: active ? '#ffffff' : '#cbd5e1',
                  background: active ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: active ? 700 : 500,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{link.label}</span>
                {link.count !== undefined ? (
                  <span
                    style={{
                      background: 'rgba(255, 255, 255, 0.16)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '9999px',
                    }}
                  >
                    {link.count}
                  </span>
                ) : (
                  <ChevronRight size={16} style={{ color: '#64748b' }} />
                )}
              </Link>
            );
          })}

          {/* Mobile Saved & Compare Quick Triggers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '4px 0' }}>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsWishlistOpen(true);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Heart size={16} fill={wishlist.length > 0 ? '#ef4444' : 'none'} color={wishlist.length > 0 ? '#ef4444' : '#cbd5e1'} />
              <span>Saved ({wishlist.length})</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCompareOpen(true);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 14px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Scale size={16} color={compareList.length > 0 ? '#a855f7' : '#cbd5e1'} />
              <span>Compare ({compareList.length})</span>
            </button>
          </div>

          <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)', margin: '6px 0' }} />

          {/* User Account / Live Chat in Mobile Menu */}
          {currentUser ? (
            <div style={{ padding: '8px 12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', margin: '6px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.88rem', fontWeight: 700 }}>
                  <UserIcon size={16} color="#10b981" />
                  <span>{currentUser.name}</span>
                </div>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#f87171',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
              <button
                onClick={() => {
                  setIsChatOpen(true);
                  setMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  background: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <MessageCircle size={15} /> Open Live Concierge Chat
              </button>
            </div>
          ) : (
            <div style={{ padding: '6px 12px' }}>
              <button
                onClick={() => {
                  openLoginModal();
                  setMobileMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <UserIcon size={16} /> Sign In / Register for Live Chat
              </button>
            </div>
          )}

          {/* Secondary Links: Orders, Research, Admin */}
          <Link
            to="/orders"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: '#94a3b8',
              padding: '10px 16px',
              fontSize: '0.88rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Track My Vehicle Order
          </Link>
          <Link
            to="/research"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: '#94a3b8',
              padding: '10px 16px',
              fontSize: '0.88rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Car Buying Guides & Articles
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              color: '#a855f7',
              padding: '10px 16px',
              fontSize: '0.88rem',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Lock size={14} /> Staff Admin Portal
          </Link>

          {/* Currency Switcher on Mobile */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              marginTop: '4px',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>Currency:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['USD', 'EUR', 'GBP'] as Currency[]).map(cur => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: currency === cur ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                    color: currency === cur ? '#09090b' : '#cbd5e1',
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
