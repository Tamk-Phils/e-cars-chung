import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Scale,
  Trash2,
  Check,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';

export const CompareDrawer: React.FC = () => {
  const {
    compareList,
    vehicles,
    toggleCompare,
    clearCompare,
    isCompareOpen,
    setIsCompareOpen,
    setSelectedVehicle,
    setCheckoutVehicle,
    formatPrice,
  } = useStore();

  if (!isCompareOpen) return null;

  const comparedVehicles = vehicles.filter(v => compareList.includes(v.id));

  return (
    <div className="modal-backdrop" onClick={() => setIsCompareOpen(false)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '1100px', padding: 0 }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Vehicle Comparison ({comparedVehicles.length} of 4)
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {comparedVehicles.length > 0 && (
              <button
                onClick={clearCompare}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                <Trash2 size={14} /> Clear All
              </button>
            )}
            <button
              onClick={() => setIsCompareOpen(false)}
              className="btn btn-secondary"
              style={{ padding: '6px 10px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowX: 'auto' }}>
          {comparedVehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <Scale size={40} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                No Vehicles Selected for Comparison
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Click the compare icon on any vehicle card to compare specifications side-by-side.
              </p>
              <button onClick={() => setIsCompareOpen(false)} className="btn btn-primary">
                Explore Vehicles
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `180px repeat(${comparedVehicles.length}, minmax(220px, 1fr))`,
                gap: '16px',
                minWidth: `${200 + comparedVehicles.length * 240}px`,
              }}
            >
              {/* Row 1: Vehicle Card Overviews */}
              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-end', paddingBottom: '16px' }}>
                VEHICLE
              </div>
              {comparedVehicles.map(v => (
                <div key={v.id} style={{ position: 'relative' }}>
                  <button
                    onClick={() => toggleCompare(v.id)}
                    title="Remove from comparison"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                  >
                    <X size={14} />
                  </button>
                  <img
                    src={v.images?.[0]}
                    alt={v.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}
                  />
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {v.condition}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px', lineHeight: 1.3 }}>
                    {v.name}
                  </h4>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
                    {formatPrice(v.price)}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        setIsCompareOpen(false);
                        setSelectedVehicle(v);
                      }}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '6px', fontSize: '0.75rem' }}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => {
                        setIsCompareOpen(false);
                        setCheckoutVehicle(v);
                      }}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '6px', fontSize: '0.75rem' }}
                    >
                      Reserve
                    </button>
                  </div>
                </div>
              ))}

              {/* Specs Rows */}
              {[
                { label: 'Year', key: 'year' },
                { label: 'Make', key: 'make' },
                { label: 'Body Style', key: 'body_type' },
                { label: 'Mileage', key: 'mileage' },
                { label: 'Engine', key: 'engine' },
                { label: 'Transmission', key: 'transmission' },
                { label: 'Drivetrain', key: 'drivetrain' },
                { label: 'Fuel Type', key: 'fuel_type' },
                { label: 'Exterior Color', key: 'exterior_color' },
                { label: 'Interior Color', key: 'interior_color' },
                { label: 'Title Status', key: 'title_status' },
                { label: 'VIN', key: 'vin' },
              ].map(row => (
                <React.Fragment key={row.key}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', padding: '10px 0', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center' }}>
                    {row.label}
                  </div>
                  {comparedVehicles.map(v => (
                    <div
                      key={v.id}
                      style={{
                        fontSize: '0.825rem',
                        padding: '10px 8px',
                        borderTop: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {(v as any)[row.key] || 'Standard'}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
