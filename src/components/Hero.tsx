import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Camera,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Flame,
  ShieldCheck,
  Fuel,
  Play,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { filters, setFilters, vehicles } = useStore();
  const navigate = useNavigate();

  const [heroTab, setHeroTab] = useState<'shop' | 'sell'>('shop');
  const [naturalQuery, setNaturalQuery] = useState('');
  const [zipCode, setZipCode] = useState('90210');
  const [distance, setDistance] = useState('50 miles');
  const [sellVin, setSellVin] = useState('');

  // Extract unique makes and models
  const makes = Array.from(new Set(vehicles.map(v => v.make))).sort();
  const models = Array.from(
    new Set(
      vehicles
        .filter(v => filters.make === 'all' || v.make === filters.make)
        .map(v => v.model)
    )
  ).sort();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (naturalQuery) {
      setFilters(prev => ({ ...prev, search: naturalQuery }));
    }
    const params = new URLSearchParams();
    if (filters.condition !== 'all') params.set('condition', filters.condition);
    if (filters.make !== 'all') params.set('make', filters.make);
    if (naturalQuery) params.set('search', naturalQuery);

    const qs = params.toString();
    navigate(qs ? `/inventory?${qs}` : '/inventory');
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/sell');
  };

  return (
    <div style={{ background: '#f7f7f8' }}>
      {/* Hero Banner with Highway Drive Background */}
      <div
        id="hero-search"
        style={{
          position: 'relative',
          minHeight: '520px',
          backgroundImage:
            'linear-gradient(to right, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.1) 60%), url("https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          display: 'flex',
          alignItems: 'center',
          padding: '48px 0',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 5 }}>
          {/* Floating White Card */}
          <div
            style={{
              maxWidth: '430px',
              background: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '28px 24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.22)',
            }}
          >
            {/* Header Title */}
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#111827',
                marginBottom: '16px',
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
              }}
            >
              Imagine the<br />possibilities
            </h1>

            {/* Top Tabs: Shop cars for sale vs Sell your car */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '18px' }}>
              <button
                type="button"
                onClick={() => setHeroTab('shop')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: heroTab === 'shop' ? '2px solid #111827' : '2px solid transparent',
                  padding: '8px 12px 10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: heroTab === 'shop' ? '#111827' : 'var(--text-muted)',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                Shop cars for sale
              </button>
              <button
                type="button"
                onClick={() => setHeroTab('sell')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: heroTab === 'sell' ? '2px solid #111827' : '2px solid transparent',
                  padding: '8px 12px 10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: heroTab === 'sell' ? '#111827' : 'var(--text-muted)',
                  cursor: 'pointer',
                  marginBottom: '-1px',
                }}
              >
                Sell your car
              </button>
            </div>

            {heroTab === 'shop' ? (
              <form onSubmit={handleSearchSubmit}>
                {/* Natural Language Search Input */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <Search
                    size={17}
                    style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    className="input"
                    placeholder="Try using your own words"
                    value={naturalQuery}
                    onChange={e => setNaturalQuery(e.target.value)}
                    style={{
                      paddingLeft: '38px',
                      paddingRight: '38px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      height: '42px',
                    }}
                  />
                  <button
                    type="button"
                    title="Visual photo search"
                    onClick={() => navigate('/inventory')}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '11px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    <Camera size={18} />
                  </button>
                </div>

                {/* Divider: — Or search by — */}
                <div
                  style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    margin: '14px 0',
                    fontWeight: 500,
                  }}
                >
                  — Or search by —
                </div>

                {/* Dropdowns Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  {/* New / Used */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600 }}>
                      New/Used
                    </label>
                    <select
                      className="select"
                      value={filters.condition}
                      onChange={e => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                      style={{ height: '40px', fontSize: '0.85rem' }}
                    >
                      <option value="all">All Conditions</option>
                      <option value="Brand New">New (2026 Models)</option>
                      <option value="Used">Used & Certified Pre-Owned</option>
                      <option value="Bank Seized / Repo">Bank Repos & Hot Deals</option>
                    </select>
                  </div>

                  {/* Make */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600 }}>
                      Make
                    </label>
                    <select
                      className="select"
                      value={filters.make}
                      onChange={e => setFilters(prev => ({ ...prev, make: e.target.value }))}
                      style={{ height: '40px', fontSize: '0.85rem' }}
                    >
                      <option value="all">All Makes</option>
                      {makes.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  {/* Model */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600 }}>
                      Model
                    </label>
                    <select
                      className="select"
                      value={filters.search}
                      onChange={e => setFilters(prev => ({ ...prev, search: e.target.value === 'all' ? '' : e.target.value }))}
                      style={{ height: '40px', fontSize: '0.85rem' }}
                    >
                      <option value="all">All Models</option>
                      {models.slice(0, 15).map(mod => (
                        <option key={mod} value={mod}>{mod}</option>
                      ))}
                    </select>
                  </div>

                  {/* Distance and ZIP */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600 }}>
                        Distance
                      </label>
                      <select
                        className="select"
                        value={distance}
                        onChange={e => setDistance(e.target.value)}
                        style={{ height: '40px', fontSize: '0.85rem' }}
                      >
                        <option value="50 miles">50 miles</option>
                        <option value="100 miles">100 miles</option>
                        <option value="All (Nationwide)">Nationwide (Free Delivery)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px', fontWeight: 600 }}>
                        ZIP
                      </label>
                      <input
                        type="text"
                        className="input"
                        placeholder="ZIP"
                        value={zipCode}
                        onChange={e => setZipCode(e.target.value)}
                        style={{ height: '40px', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Primary Search Button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    height: '46px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-purple)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                  }}
                >
                  <span>Search {vehicles.length} cars</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', opacity: 0.9 }} />
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', opacity: 0.5 }} />
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fff', opacity: 0.5 }} />
                  </div>
                </button>
              </form>
            ) : (
              /* Sell Your Car Tab View */
              <form onSubmit={handleSellSubmit} style={{ padding: '10px 0' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '8px' }}>Get an Instant Cash Offer</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.4 }}>
                  Enter your license plate or VIN to receive a guaranteed buyout offer in under 2 minutes.
                </p>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter License Plate or VIN"
                  value={sellVin}
                  onChange={e => setSellVin(e.target.value)}
                  style={{ marginBottom: '12px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px', fontWeight: 700 }}>
                  Get Instant Valuation
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Small Bottom-Right Sponsored Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '24px',
            background: 'rgba(0, 0, 0, 0.75)',
            color: '#ffffff',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(4px)',
            maxWidth: '380px',
            fontSize: '0.72rem',
          }}
          className="desk-only"
        >
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 800 }}>
            <Sparkles size={14} style={{ color: 'var(--accent-purple)' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700 }}>Featured Showcase: 2026 Factory Allocations</div>
            <div style={{ color: '#d1d5db' }}>Porsche GT3 RS, Tesla Plaid, G63 AMG — Ready for Enclosed Delivery</div>
          </div>
        </div>
      </div>

      {/* Two Prominent Editorial Spotlight Cards */}
      <div className="container" style={{ padding: '36px 20px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Card 1: Browse free offers */}
          <div
            onClick={() => navigate('/inventory?hotDeals=true')}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-xs)')}
          >
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px', color: '#111827' }}>
                  Browse Free Offers & Deals
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.45 }}>
                  From financing incentives to free nationwide delivery & certified warranties, find deals to help you save.
                </p>
              </div>

              <div style={{ marginTop: '16px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#111827',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  Shop deals
                </span>
              </div>
            </div>

            <div style={{ background: '#f3f4f6', height: '100%', minHeight: '160px' }}>
              <img
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80"
                alt="Car offers"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Card 2: 8 Compact SUVs, only 1 champion */}
          <div
            onClick={() => navigate('/research')}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              transition: 'box-shadow 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-xs)')}
          >
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '8px', color: '#111827' }}>
                  8 Compact SUVs, only 1 champion
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.45 }}>
                  Our certified automotive experts test and rank the top SUVs and performance crossovers of 2026.
                </p>
              </div>

              <div style={{ marginTop: '16px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#111827',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  Read review
                </span>
              </div>
            </div>

            <div style={{ background: '#f3f4f6', height: '100%', minHeight: '160px' }}>
              <img
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80"
                alt="SUVs on mountain"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
