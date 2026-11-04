import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { VehicleCard } from '../components/VehicleCard';
import {
  SlidersHorizontal,
  Grid,
  List,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle,
  X,
  Search,
  Filter,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export const InventoryPage: React.FC = () => {
  const { vehicles, filters, setFilters, resetFilters } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL search params to filters
  useEffect(() => {
    const condParam = searchParams.get('condition');
    const makeParam = searchParams.get('make');
    const searchParam = searchParams.get('search');
    const hotDealsParam = searchParams.get('hotDeals');

    if (condParam || makeParam || searchParam || hotDealsParam) {
      setFilters(prev => ({
        ...prev,
        condition: (condParam as any) || prev.condition,
        make: makeParam || prev.make,
        search: searchParam || prev.search,
        onlyHotDeals: hotDealsParam === 'true' ? true : prev.onlyHotDeals,
      }));
    }
  }, [searchParams]);

  // Extract unique makes with counts
  const makesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      counts[v.make] = (counts[v.make] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [vehicles]);

  const bodyTypesWithCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      if (v.body_type) {
        counts[v.body_type] = (counts[v.body_type] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [vehicles]);

  const fuelTypes = ['Gasoline', 'Electric', 'Hybrid', 'Diesel'];
  const transmissions = ['Automatic', 'Manual'];

  // Filter and sort vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter(v => {
        // Search filter
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchName = v.name.toLowerCase().includes(q);
          const matchMake = v.make.toLowerCase().includes(q);
          const matchModel = v.model.toLowerCase().includes(q);
          const matchVin = v.vin.toLowerCase().includes(q);
          const matchDesc = v.description.toLowerCase().includes(q);
          if (!matchName && !matchMake && !matchModel && !matchVin && !matchDesc) return false;
        }

        // Condition filter
        if (filters.condition !== 'all') {
          if (filters.condition === 'Used') {
            if (v.condition !== 'Used' && v.condition !== 'Certified Pre-Owned') return false;
          } else if (v.condition !== filters.condition) {
            return false;
          }
        }

        // Make filter
        if (filters.make !== 'all' && v.make !== filters.make) return false;

        // Body Type filter
        if (filters.bodyType !== 'all' && v.body_type !== filters.bodyType) return false;

        // Price filter
        if (v.price > filters.maxPrice) return false;
        if (v.price < filters.minPrice) return false;

        // Year filter
        if (v.year < filters.minYear || v.year > filters.maxYear) return false;

        // Transmission filter
        if (filters.transmission !== 'all') {
          if (!v.transmission.toLowerCase().includes(filters.transmission.toLowerCase())) return false;
        }

        // Fuel Type filter
        if (filters.fuelType !== 'all') {
          if (!v.fuel_type.toLowerCase().includes(filters.fuelType.toLowerCase())) return false;
        }

        // Hot deals only
        if (filters.onlyHotDeals && !v.is_hot_deal) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.price - b.price;
        if (filters.sortBy === 'price-desc') return b.price - a.price;
        if (filters.sortBy === 'year-desc') return b.year - a.year;
        if (filters.sortBy === 'mileage-asc') {
          const numA = parseInt(a.mileage.replace(/\D/g, '') || '0', 10);
          const numB = parseInt(b.mileage.replace(/\D/g, '') || '0', 10);
          return numA - numB;
        }
        return a.sort_order - b.sort_order;
      });
  }, [vehicles, filters]);

  const handleConditionSelect = (cond: typeof filters.condition) => {
    setFilters(prev => ({ ...prev, condition: cond }));
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (cond === 'all') next.delete('condition');
      else next.set('condition', cond);
      return next;
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.condition !== 'all' ||
    filters.make !== 'all' ||
    filters.bodyType !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 300000 ||
    filters.minYear > 1970 ||
    filters.maxYear < 2026 ||
    filters.transmission !== 'all' ||
    filters.fuelType !== 'all' ||
    filters.onlyHotDeals;

  return (
    <div style={{ background: '#f7f7f8', minHeight: '85vh', padding: '32px 0 64px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '16px' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>Vehicles Inventory</span>
        </div>

        {/* Header Title & Condition Switcher Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>
              Search Cars For Sale
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>
              Showing {filteredVehicles.length} of {vehicles.length} verified available vehicles
            </p>
          </div>

          {/* Quick Condition Tabs */}
          <div style={{ display: 'flex', background: '#e5e7eb', padding: '4px', borderRadius: 'var(--radius-md)', gap: '4px' }}>
            <button
              onClick={() => handleConditionSelect('all')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: filters.condition === 'all' ? '#ffffff' : 'transparent',
                color: filters.condition === 'all' ? '#111827' : '#4b5563',
                boxShadow: filters.condition === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              All ({vehicles.length})
            </button>
            <button
              onClick={() => handleConditionSelect('Brand New')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: filters.condition === 'Brand New' ? '#ffffff' : 'transparent',
                color: filters.condition === 'Brand New' ? 'var(--accent-purple)' : '#4b5563',
                boxShadow: filters.condition === 'Brand New' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Brand New
            </button>
            <button
              onClick={() => handleConditionSelect('Used')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: filters.condition === 'Used' ? '#ffffff' : 'transparent',
                color: filters.condition === 'Used' ? '#059669' : '#4b5563',
                boxShadow: filters.condition === 'Used' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              CPO & Used
            </button>
            <button
              onClick={() => handleConditionSelect('Bank Seized / Repo')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: filters.condition === 'Bank Seized / Repo' ? '#ffffff' : 'transparent',
                color: filters.condition === 'Bank Seized / Repo' ? '#e11d48' : '#4b5563',
                boxShadow: filters.condition === 'Bank Seized / Repo' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              Bank Repos
            </button>
          </div>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="mobile-filter-bar" style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="btn btn-secondary"
            style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', fontWeight: 700 }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SlidersHorizontal size={16} color="var(--accent-purple)" />
              {mobileFilterOpen ? 'Hide Search Filters' : 'Refine & Filter Inventory'}
            </span>
            {hasActiveFilters && (
              <span style={{ background: 'var(--accent-purple)', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                Active
              </span>
            )}
          </button>
        </div>

        {/* Main Content Layout: Sidebar Filters + Vehicles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px', alignItems: 'start' }} className="inventory-grid-wrapper">
          {/* Left Sidebar Filter Panel */}
          <aside
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              position: 'sticky',
              top: '84px',
            }}
            className={`filter-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.95rem' }}>
                <SlidersHorizontal size={17} style={{ color: 'var(--accent-purple)' }} />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-purple)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RotateCcw size={12} /> Reset All
                </button>
              )}
            </div>

            {/* Keyword Search Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Keyword / Model / VIN
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '12px', color: '#9ca3af' }} />
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Porsche, Plaid, V8..."
                  value={filters.search}
                  onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  style={{ paddingLeft: '32px', height: '38px', fontSize: '0.85rem' }}
                />
                {filters.search && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                    style={{ position: 'absolute', right: '10px', top: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Make Filter Dropdown */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Make ({makesWithCounts.length} brands)
              </label>
              <select
                className="select"
                value={filters.make}
                onChange={e => setFilters(prev => ({ ...prev, make: e.target.value }))}
                style={{ height: '38px', fontSize: '0.85rem' }}
              >
                <option value="all">All Makes</option>
                {makesWithCounts.map(([make, count]) => (
                  <option key={make} value={make}>{make} ({count})</option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Body Style
              </label>
              <select
                className="select"
                value={filters.bodyType}
                onChange={e => setFilters(prev => ({ ...prev, bodyType: e.target.value }))}
                style={{ height: '38px', fontSize: '0.85rem' }}
              >
                <option value="all">All Body Styles</option>
                {bodyTypesWithCounts.map(([body, count]) => (
                  <option key={body} value={body}>{body} ({count})</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151' }}>Max Price</label>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                  ${filters.maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={300000}
                step={5000}
                value={filters.maxPrice}
                onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#9ca3af', marginTop: '2px' }}>
                <span>$10,000</span>
                <span>$300,000+</span>
              </div>
            </div>

            {/* Year Range */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151' }}>Minimum Year</label>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                  {filters.minYear}
                </span>
              </div>
              <input
                type="range"
                min={1975}
                max={2026}
                step={1}
                value={filters.minYear}
                onChange={e => setFilters(prev => ({ ...prev, minYear: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
              />
            </div>

            {/* Transmission */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Transmission
              </label>
              <select
                className="select"
                value={filters.transmission}
                onChange={e => setFilters(prev => ({ ...prev, transmission: e.target.value }))}
                style={{ height: '38px', fontSize: '0.85rem' }}
              >
                <option value="all">All Transmissions</option>
                {transmissions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                Fuel / Powertrain
              </label>
              <select
                className="select"
                value={filters.fuelType}
                onChange={e => setFilters(prev => ({ ...prev, fuelType: e.target.value }))}
                style={{ height: '38px', fontSize: '0.85rem' }}
              >
                <option value="all">All Fuel Types</option>
                {fuelTypes.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Hot Deals Toggle */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700, color: '#e11d48' }}>
                <input
                  type="checkbox"
                  checked={filters.onlyHotDeals}
                  onChange={e => setFilters(prev => ({ ...prev, onlyHotDeals: e.target.checked }))}
                  style={{ accentColor: '#e11d48', width: '16px', height: '16px' }}
                />
                <Flame size={15} /> Hot Deals / Liquidation Only
              </label>
            </div>
          </aside>

          {/* Right Area: Results Header + Vehicles Grid */}
          <div>
            {/* Control Bar: Sort + View Mode */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>Sort By:</span>
                <select
                  className="select"
                  value={filters.sortBy}
                  onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                  style={{ height: '34px', fontSize: '0.8rem', padding: '4px 10px', width: 'auto' }}
                >
                  <option value="featured">Featured / Best Match</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="year-desc">Year: Newest First</option>
                  <option value="mileage-asc">Mileage: Lowest First</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f3f4f6', padding: '3px', borderRadius: 'var(--radius-md)' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  style={{
                    background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: viewMode === 'grid' ? 'var(--accent-purple)' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  <Grid size={15} /> Grid
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  style={{
                    background: viewMode === 'list' ? '#ffffff' : 'transparent',
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: viewMode === 'list' ? 'var(--accent-purple)' : '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  <List size={15} /> List
                </button>
              </div>
            </div>

            {/* Active Filter Badges */}
            {hasActiveFilters && (
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                {filters.condition !== 'all' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ede9fe', color: 'var(--accent-purple)', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    Condition: {filters.condition}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => handleConditionSelect('all')} />
                  </span>
                )}
                {filters.make !== 'all' && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ede9fe', color: 'var(--accent-purple)', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    Make: {filters.make}
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilters(prev => ({ ...prev, make: 'all' }))} />
                  </span>
                )}
                {filters.search && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ede9fe', color: 'var(--accent-purple)', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    "{filters.search}"
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilters(prev => ({ ...prev, search: '' }))} />
                  </span>
                )}
                {filters.onlyHotDeals && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#ffe4e6', color: '#e11d48', fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    🔥 Hot Deals Only
                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => setFilters(prev => ({ ...prev, onlyHotDeals: false }))} />
                  </span>
                )}
              </div>
            )}

            {/* Vehicles List / Grid */}
            {filteredVehicles.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'list' ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '20px',
                }}
              >
                {filteredVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)' }}>
                <Search size={40} style={{ color: '#9ca3af', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
                  No Vehicles Match Your Search
                </h3>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 20px' }}>
                  Try adjusting your price slider, clearing the keyword search, or selecting "All Makes" to explore available inventory.
                </p>
                <button onClick={resetFilters} className="btn btn-primary" style={{ padding: '8px 20px' }}>
                  <RotateCcw size={14} /> Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

