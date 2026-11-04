import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vehicle } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Heart,
  Scale,
  Gauge,
  Fuel,
  Cog,
  CheckCircle,
  Eye,
  ShoppingBag,
  Flame,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, viewMode = 'grid' }) => {
  const {
    formatPrice,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    setSelectedVehicle,
    setCheckoutVehicle,
  } = useStore();

  const navigate = useNavigate();
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  const isFavorited = isInWishlist(vehicle.id);
  const isCompared = isInCompare(vehicle.id);

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  ];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex(prev => (prev - 1 + images.length) % images.length);
  };

  // Calculate estimated monthly payment: 60 months at 6.5% interest with 10% down
  const principal = vehicle.price * 0.9;
  const monthlyRate = 0.065 / 12;
  const months = 60;
  const estimatedMonthly = Math.round(
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
    (Math.pow(1 + monthlyRate, months) - 1)
  );

  const handleCardClick = () => {
    navigate(`/vehicle/${vehicle.id}`);
  };

  return (
    <div
      className={`card-panel ${viewMode === 'list' ? 'vehicle-card-list' : ''}`}
      style={{
        display: 'flex',
        flexDirection: viewMode === 'list' ? 'row' : 'column',
        position: 'relative',
        cursor: 'pointer',
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      onClick={handleCardClick}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Image Container */}
      <div
        className={viewMode === 'list' ? 'vehicle-card-list-img' : ''}
        style={{
          position: 'relative',
          width: viewMode === 'list' ? '320px' : '100%',
          height: viewMode === 'list' ? '240px' : '220px',
          flexShrink: 0,
          background: '#f1f3f5',
          overflow: 'hidden',
        }}
      >
        <img
          src={images[activeImgIndex]}
          alt={vehicle.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Carousel arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              title="Previous image"
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#111827',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextImage}
              title="Next image"
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#111827',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        {/* Photo Count badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}
        >
          {activeImgIndex + 1}/{images.length}
        </div>

        {/* Badges on top left */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {vehicle.condition === 'Brand New' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--accent-purple)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <Sparkles size={11} /> 2026 Factory
            </span>
          )}

          {vehicle.is_hot_deal && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--accent-rose)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              <Flame size={11} /> Hot Deal
            </span>
          )}

          {vehicle.condition === 'Certified Pre-Owned' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'var(--accent-green)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <ShieldCheck size={11} /> 150-Pt Inspected
            </span>
          )}

          {vehicle.condition === 'Bank Seized / Repo' && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: '#4c1d95',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Bank Seized
            </span>
          )}
        </div>

        {/* Quick action buttons on top right (Favorite & Compare) */}
        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '6px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(vehicle.id);
            }}
            title={isFavorited ? 'Remove from wishlist' : 'Save vehicle'}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              color: isFavorited ? '#ef4444' : '#4b5563',
            }}
          >
            <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCompare(vehicle.id);
            }}
            title={isCompared ? 'Remove from compare' : 'Compare'}
            style={{
              background: isCompared ? 'var(--accent-purple)' : 'rgba(255, 255, 255, 0.9)',
              color: isCompared ? '#ffffff' : '#4b5563',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            <Scale size={15} />
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexGrow: 1,
        }}
      >
        <div>
          {/* Condition & Year Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
            <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.year}</span>
            <span>•</span>
            <span>{vehicle.condition}</span>
            {vehicle.trim && (
              <>
                <span>•</span>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{vehicle.trim}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.35,
              marginBottom: '10px',
            }}
          >
            {vehicle.name}
          </h3>

          {/* Key Specs Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              fontSize: '0.75rem',
              color: '#4b5563',
              marginBottom: '14px',
              padding: '8px 10px',
              background: '#f9fafb',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Gauge size={13} style={{ color: 'var(--accent-purple)' }} />
              <span>{vehicle.mileage}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Cog size={13} style={{ color: 'var(--accent-purple)' }} />
              <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {vehicle.transmission.split(' ')[0]}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Fuel size={13} style={{ color: 'var(--accent-purple)' }} />
              <span>{vehicle.fuel_type}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Truck size={13} style={{ color: '#059669' }} />
              <span>Nationwide Ship</span>
            </div>
          </div>
        </div>

        {/* Pricing & Footer Actions */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, color: '#111827' }}>
                  {formatPrice(vehicle.price)}
                </span>
                {vehicle.sale_price && (
                  <span style={{ fontSize: '0.85rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                    {formatPrice(vehicle.sale_price)}
                  </span>
                )}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                ${estimatedMonthly}/mo. est.
              </div>
            </div>

            {vehicle.down_payment && (
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#9ca3af', display: 'block' }}>Down Payment</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#111827' }}>
                  {formatPrice(vehicle.down_payment)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/vehicle/${vehicle.id}`);
              }}
              className="btn btn-secondary"
              style={{ padding: '9px 12px', fontSize: '0.85rem', fontWeight: 700 }}
            >
              View Full Specs
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setCheckoutVehicle(vehicle);
              }}
              className="btn btn-primary"
              disabled={vehicle.is_sold}
              style={{
                padding: '9px 12px',
                fontSize: '0.85rem',
                opacity: vehicle.is_sold ? 0.5 : 1,
                cursor: vehicle.is_sold ? 'not-allowed' : 'pointer',
              }}
            >
              <ShoppingBag size={14} /> {vehicle.is_sold ? 'Sold' : 'Hold $500'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
