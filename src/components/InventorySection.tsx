import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { VehicleCard } from './VehicleCard';
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
} from 'lucide-react';

export const InventorySection: React.FC = () => {
  const { vehicles, filters, setFilters, resetFilters } = useStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
          const mA = parseInt(a.mileage.replace(/\D/g, '') || '0');
          const mB = parseInt(b.mileage.replace(/\D/g, '') || '0');
          return mA - mB;
        }
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        return a.sort_order - b.sort_order;
      });
  }, [vehicles, filters]);

  const hasActiveFilters =
    filters.search !== '' ||
    filters.condition !== 'all' ||
    filters.make !== 'all' ||
    filters.bodyType !== 'all' ||
    filters.maxPrice < 300000 ||
    filters.minPrice > 0 ||
    filters.transmission !== 'all' ||
    filters.fuelType !== 'all' ||
    filters.onlyHotDeals;

  return (
    <section id="inventory-section" style={{ padding: '30px 0 70px', background: '#ffffff' }}>
      <div className="container">
        {/* Title Bar & Quick Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Shop Cars for Sale
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                ({filteredVehicles.length} matches)
              </span>
            </h2>
          </div>

          {/* Controls: Mobile trigger, Sort dropdown, Grid/List */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMobileFilterOpen(prev => !prev)}
              className="btn btn-secondary mobile-filter-btn"
              style={{ display: 'none' }}
            >
              <Filter size={16} /> Filters {hasActiveFilters && '•'}
            </button>

            {/* Sort by Dropdown */}
            <select
              className="select"
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              style={{ width: 'auto', minWidth: '190px', padding: '8px 12px', fontSize: '0.85rem' }}
            >
              <option value="featured">Sort by: Best Match</option>
              <option value="price-asc">Price: Lowest First</option>
              <option value="price-desc">Price: Highest First</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="mileage-asc">Mileage: Lowest First</option>
            </select>

            {/* Grid / List View Toggle */}
            <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 'var(--radius-md)', padding: '3px', border: '1px solid #e5e7eb' }}>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid view"
                style={{
                  background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                  color: viewMode === 'grid' ? '#111827' : 'var(--text-muted)',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List view"
                style={{
                  background: viewMode === 'list' ? '#ffffff' : 'transparent',
                  color: viewMode === 'list' ? '#111827' : 'var(--text-muted)',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filters:</span>
            {filters.condition !== 'all' && (
              <span className="badge badge-brand-new" style={{ cursor: 'pointer', background: 'var(--accent-purple-light)', color: 'var(--accent-purple)' }} onClick={() => setFilters(prev => ({ ...prev, condition: 'all' }))}>
                {filters.condition} <X size={12} />
              </span>
            )}
            {filters.make !== 'all' && (
              <span className="badge badge-used" style={{ cursor: 'pointer' }} onClick={() => setFilters(prev => ({ ...prev, make: 'all' }))}>
                Make: {filters.make} <X size={12} />
              </span>
            )}
            {filters.bodyType !== 'all' && (
              <span className="badge badge-used" style={{ cursor: 'pointer' }} onClick={() => setFilters(prev => ({ ...prev, bodyType: 'all' }))}>
                Body: {filters.bodyType} <X size={12} />
              </span>
            )}
            {filters.fuelType !== 'all' && (
              <span className="badge badge-used" style={{ cursor: 'pointer' }} onClick={() => setFilters(prev => ({ ...prev, fuelType: 'all' }))}>
                Fuel: {filters.fuelType} <X size={12} />
              </span>
            )}
            {filters.maxPrice < 300000 && (
              <span className="badge badge-used" style={{ cursor: 'pointer' }} onClick={() => setFilters(prev => ({ ...prev, maxPrice: 300000 }))}>
                Under ${filters.maxPrice.toLocaleString()} <X size={12} />
              </span>
            )}
            {filters.search && (
              <span className="badge badge-used" style={{ cursor: 'pointer' }} onClick={() => setFilters(prev => ({ ...prev, search: '' }))}>
                "{filters.search}" <X size={12} />
              </span>
            )}
            <button
              onClick={resetFilters}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-purple)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 700,
                marginLeft: '8px',
              }}
            >
              <RotateCcw size={12} /> Clear all
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar Filters + Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px' }} className="inventory-layout">
          {/* Sidebar */}
          <aside
            className={`inventory-sidebar ${mobileFilterOpen ? 'mobile-open' : ''}`}
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              height: 'fit-content',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e5e7eb' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>
                Filter Vehicles
              </span>
              <button
                onClick={resetFilters}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-purple)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>

            {/* Condition Filters */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                Condition
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { id: 'all', label: 'All Cars', count: vehicles.length },
                  { id: 'Brand New', label: 'Brand New 2026', count: vehicles.filter(v => v.condition === 'Brand New').length },
                  { id: 'Certified Pre-Owned', label: 'Certified Pre-Owned', count: vehicles.filter(v => v.condition === 'Certified Pre-Owned').length },
                  { id: 'Used', label: 'Used / Pre-Owned', count: vehicles.filter(v => v.condition === 'Used').length },
                  { id: 'Bank Seized / Repo', label: 'Bank Repo Liquidation', count: vehicles.filter(v => v.condition === 'Bank Seized / Repo').length },
                ].map(c => (
                  <label
                    key={c.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: filters.condition === c.id ? '#f3f4f6' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="radio"
                        name="condition-filter"
                        checked={filters.condition === c.id}
                        onChange={() => setFilters(prev => ({ ...prev, condition: c.id }))}
                        style={{ accentColor: 'var(--accent-purple)' }}
                      />
                      <span style={{ fontWeight: filters.condition === c.id ? 700 : 500, color: '#111827' }}>{c.label}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({c.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Make Filter */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                Make
              </label>
              <select
                className="select"
                value={filters.make}
                onChange={e => setFilters(prev => ({ ...prev, make: e.target.value }))}
                style={{ height: '38px', fontSize: '0.85rem' }}
              >
                <option value="all">All Makes ({vehicles.length})</option>
                {makesWithCounts.map(([make, count]) => (
                  <option key={make} value={make}>
                    {make} ({count})
                  </option>
                ))}
              </select>
            </div>

            {/* Body Style */}
            <div style={{ marginBottom: '22px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                Body Style
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, bodyType: 'all' }))}
                  style={{
                    padding: '6px 8px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.78rem',
                    background: filters.bodyType === 'all' ? 'var(--accent-purple)' : '#f3f4f6',
                    color: filters.bodyType === 'all' ? '#fff' : '#374151',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  All
                </button>
                {bodyTypesWithCounts.slice(0, 7).map(([bType, count]) => (
                  <button
                    key={bType}
                    onClick={() => setFilters(prev => ({ ...prev, bodyType: bType }))}
                    style={{
                      padding: '6px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem',
                      background: filters.bodyType === bType ? 'var(--accent-purple)' : '#f3f4f6',
                      color: filters.bodyType === bType ? '#fff' : '#374151',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {bType}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: 700, color: '#111827' }}>Max Price</span>
                <span style={{ fontWeight: 800, color: 'var(--accent-purple)' }}>
                  ${filters.maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="300000"
                step="5000"
                value={filters.maxPrice}
                onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                <span>$5k</span>
                <span>$150k</span>
                <span>$300k+</span>
              </div>
            </div>

            {/* Fuel Type */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                Fuel Type
              </label>
              <select
                className="select"
                value={filters.fuelType}
                onChange={e => setFilters(prev => ({ ...prev, fuelType: e.target.value }))}
                style={{ height: '38px', fontSize: '0.85rem' }}
              >
                <option value="all">All Powertrains</option>
                {fuelTypes.map(ft => (
                  <option key={ft} value={ft}>{ft}</option>
                ))}
              </select>
            </div>
          </aside>

          {/* Cards Grid */}
          <div>
            {filteredVehicles.length === 0 ? (
              <div
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Search size={24} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '6px', color: '#111827' }}>
                  No Vehicles Found
                </h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 20px', fontSize: '0.9rem' }}>
                  We couldn't find vehicles matching your active criteria. Try broadening your price range or make selection.
                </p>
                <button onClick={resetFilters} className="btn btn-primary">
                  <RotateCcw size={16} /> Reset All Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr',
                  gap: '20px',
                }}
              >
                {filteredVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .inventory-layout {
            grid-template-columns: 1fr !important;
          }
          .inventory-sidebar {
            display: none;
          }
          .inventory-sidebar.mobile-open {
            display: block !important;
          }
          .mobile-filter-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </section>
  );
};
