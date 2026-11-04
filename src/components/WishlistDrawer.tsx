import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  ExternalLink,
} from 'lucide-react';

export const WishlistDrawer: React.FC = () => {
  const {
    wishlist,
    vehicles,
    toggleWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    setSelectedVehicle,
    setCheckoutVehicle,
    formatPrice,
  } = useStore();

  if (!isWishlistOpen) return null;

  const savedVehicles = vehicles.filter(v => wishlist.includes(v.id));

  return (
    <div className="modal-backdrop" onClick={() => setIsWishlistOpen(false)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: 0 }}
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
            <Heart size={20} fill="#f43f5e" color="#f43f5e" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              Saved Vehicles ({savedVehicles.length})
            </h2>
          </div>

          <button
            onClick={() => setIsWishlistOpen(false)}
            className="btn btn-secondary"
            style={{ padding: '6px 10px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {savedVehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>
              <Heart size={44} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
                Your Wishlist is Empty
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Save your favorite cars by clicking the heart icon on any listing to compare and track them here.
              </p>
              <button onClick={() => setIsWishlistOpen(false)} className="btn btn-primary">
                Browse All Vehicles
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {savedVehicles.map(v => (
                <div
                  key={v.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={v.images?.[0]}
                    alt={v.name}
                    style={{ width: '100px', height: '70px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                  />

                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                      {v.condition} • {v.year}
                    </div>
                    <h4
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {v.name}
                    </h4>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatPrice(v.price)}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        setIsWishlistOpen(false);
                        setCheckoutVehicle(v);
                      }}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      <ShoppingBag size={13} /> Reserve
                    </button>
                    <button
                      onClick={() => toggleWishlist(v.id)}
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      <Trash2 size={13} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
