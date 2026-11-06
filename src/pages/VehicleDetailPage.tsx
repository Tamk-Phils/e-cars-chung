import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { VehicleCard } from '../components/VehicleCard';
import {
  Sparkles,
  Flame,
  CheckCircle,
  ShieldCheck,
  Truck,
  RotateCcw,
  Calendar,
  Gauge,
  Cog,
  Fuel,
  DollarSign,
  Heart,
  Scale,
  ShoppingBag,
  Share2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Send,
  Printer,
  Check,
  PhoneCall,
  Mail,
  Lock,
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    vehicles,
    formatPrice,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
    setCheckoutVehicle,
  } = useStore();
  const navigate = useNavigate();

  const vehicle = vehicles.find(v => v.id === id || v.slug === id);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(6.5);
  const [copiedLink, setCopiedLink] = useState(false);

  // Test drive / consultation modal state
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [testDriveName, setTestDriveName] = useState('');
  const [testDrivePhone, setTestDrivePhone] = useState('');
  const [testDriveDate, setTestDriveDate] = useState('');
  const [testDriveConfirmed, setTestDriveConfirmed] = useState(false);

  if (!vehicle) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', background: '#f7f7f8' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
          Vehicle Not Found
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '24px' }}>
          The vehicle you requested may have been reserved or relocated.
        </p>
        <Link to="/inventory" className="btn btn-primary" style={{ padding: '10px 24px' }}>
          Return to Vehicle Inventory
        </Link>
      </div>
    );
  }

  const images = vehicle.images && vehicle.images.length > 0 ? vehicle.images : [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  ];

  const isFavorited = isInWishlist(vehicle.id);
  const isCompared = isInCompare(vehicle.id);

  // Loan calculation
  const downPaymentAmount = Math.round((vehicle.price * downPaymentPercent) / 100);
  const loanPrincipal = Math.max(0, vehicle.price - downPaymentAmount);
  const monthlyInterest = (interestRate / 100) / 12;
  const monthlyPayment = loanPrincipal > 0
    ? Math.round((loanPrincipal * (monthlyInterest * Math.pow(1 + monthlyInterest, loanTermMonths))) / (Math.pow(1 + monthlyInterest, loanTermMonths) - 1))
    : 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle.name,
        text: `Check out this ${vehicle.name} on Chung Motors`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleTestDriveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTestDriveConfirmed(true);
    setTimeout(() => {
      setTestDriveConfirmed(false);
      setIsTestDriveOpen(false);
      setTestDriveName('');
      setTestDrivePhone('');
      setTestDriveDate('');
    }, 3000);
  };

  // Similar vehicles
  const relatedVehicles = vehicles
    .filter(v => v.id !== vehicle.id && (v.make === vehicle.make || v.body_type === vehicle.body_type))
    .slice(0, 4);

  return (
    <div style={{ background: '#f7f7f8', minHeight: '90vh', padding: '16px 0 64px' }}>
      <div className="container" style={{ padding: '0 16px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '16px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '4px' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/inventory" style={{ color: '#6b7280', textDecoration: 'none' }}>Inventory</Link>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>{vehicle.make} {vehicle.model}</span>
        </div>

        {/* Top Header Card */}
        <div
          className="vehicle-detail-header-card"
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 'var(--radius-lg)',
            padding: '20px 24px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ flex: '1 1 320px', minWidth: 0 }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 9px',
                  borderRadius: 'var(--radius-full)',
                  background: vehicle.condition === 'Bank Seized / Repo' ? '#ffe4e6' : '#ecfdf5',
                  color: vehicle.condition === 'Bank Seized / Repo' ? '#e11d48' : '#059669',
                }}
              >
                {vehicle.condition === 'Bank Seized / Repo' ? '🔥 Bank Repo Deal' : '🛡️ Certified Inspected'}
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: 'var(--radius-full)', background: '#f3f4f6', color: '#374151' }}>
                VIN: {vehicle.vin}
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: 'var(--radius-full)', background: '#f3f4f6', color: '#374151' }}>
                {vehicle.title_status}
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)',
                fontWeight: 800,
                color: '#111827',
                letterSpacing: '-0.02em',
                margin: 0,
                lineHeight: 1.25,
                wordBreak: 'break-word',
              }}
            >
              {vehicle.name}
            </h1>

            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
              {vehicle.trim || vehicle.model} • {vehicle.mileage} • {vehicle.transmission} • {vehicle.exterior_color}
            </p>
          </div>

          {/* Pricing & Primary Action */}
          <div className="vehicle-detail-pricing-box" style={{ flex: '1 1 280px' }}>
            <div style={{ fontSize: 'clamp(1.6rem, 4vw, 2.1rem)', fontWeight: 800, color: '#111827' }}>
              {formatPrice(vehicle.price)}
            </div>
            {vehicle.sale_price && (
              <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700 }}>
                Wholesale Value: <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>{formatPrice(vehicle.sale_price + 6000)}</span>
              </div>
            )}
            <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px' }}>
              Est. ${monthlyPayment}/mo (${downPaymentPercent}% down, 60 mo)
            </div>

            {/* CTAs */}
            <div
              className="vehicle-cta-buttons"
              style={{
                display: 'flex',
                gap: '8px',
                marginTop: '14px',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setCheckoutVehicle(vehicle)}
                className="btn btn-primary"
                style={{
                  flex: '1 1 100%',
                  padding: '12px 18px',
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <ShoppingBag size={18} />
                <span>Reserve Vehicle For $500</span>
              </button>

              <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                <button
                  onClick={() => toggleWishlist(vehicle.id)}
                  className="btn btn-secondary"
                  title="Save Vehicle"
                  style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                >
                  <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : 'currentColor'} />
                  <span style={{ fontSize: '0.8rem' }}>{isFavorited ? 'Saved' : 'Save'}</span>
                </button>
                <button
                  onClick={() => toggleCompare(vehicle.id)}
                  className="btn btn-secondary"
                  title="Compare Vehicle"
                  style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', color: isCompared ? 'var(--accent-purple)' : 'inherit' }}
                >
                  <Scale size={16} />
                  <span style={{ fontSize: '0.8rem' }}>Compare</span>
                </button>
                <button
                  onClick={handleShare}
                  className="btn btn-secondary"
                  title="Share Vehicle"
                  style={{ flex: 1, padding: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
                >
                  {copiedLink ? <Check size={16} style={{ color: '#059669' }} /> : <Share2 size={16} />}
                  <span style={{ fontSize: '0.8rem' }}>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Gallery + Specifications */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }} className="vehicle-details-layout">
          {/* Left Column: Photo Gallery + Overview */}
          <div style={{ minWidth: 0 }}>
            {/* Main Stage Image */}
            <div
              className="vehicle-gallery-stage"
              style={{
                background: '#09090b',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                height: '420px',
                marginBottom: '12px',
                border: '1px solid #e5e7eb',
              }}
            >
              <img
                src={images[activeImgIndex]}
                alt={vehicle.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80';
                }}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex(prev => (prev - 1 + images.length) % images.length)}
                    aria-label="Previous photo"
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.65)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveImgIndex(prev => (prev + 1) % images.length)}
                    aria-label="Next photo"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.65)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: '#ffffff',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                Photo {activeImgIndex + 1} of {images.length}
              </div>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', WebkitOverflowScrolling: 'touch' }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    style={{
                      width: '76px',
                      height: '52px',
                      flexShrink: 0,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: activeImgIndex === i ? '2px solid var(--accent-purple)' : '2px solid transparent',
                      opacity: activeImgIndex === i ? 1 : 0.65,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <img src={img} alt={`Angle ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Vehicle Description */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '10px' }}>
                Vehicle Overview & Condition Report
              </h3>
              <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                {vehicle.description}
              </p>
            </div>

            {/* Features Checklist */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '14px' }}>
                  Factory Features & Equipment
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {vehicle.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#374151' }}>
                      <CheckCircle size={15} style={{ color: '#059669', flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 150-Point Certified Inspection Breakdown */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    150-Point Safety & Mechanical Inspection
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                    Certified Passed All Diagnostic Tests
                  </span>
                </div>
              </div>

              <div className="inspection-check-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Engine & Transmission</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Pass</span>
                </div>
                <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Brakes & ABS</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Pass</span>
                </div>
                <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>Frame Integrity</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Clean</span>
                </div>
                <div style={{ padding: '10px 12px', background: '#f9fafb', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#4b5563' }}>OBD-II Diagnostics</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Zero Codes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Technical Specs & Financing Estimator */}
          <div style={{ minWidth: 0 }}>
            {/* Complete Technical Specifications Grid */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '14px' }}>
                Vehicle Specifications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Make</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.make}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Model</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.model}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Year</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.year}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Mileage</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.mileage}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Transmission</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.transmission}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Fuel Type</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.fuel_type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Drivetrain</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.drivetrain || 'All-Wheel Drive'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Body Style</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.body_type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Exterior Color</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.exterior_color}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span style={{ color: '#6b7280' }}>Title Status</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>{vehicle.title_status}</span>
                </div>
              </div>
            </div>

            {/* Interactive Dynamic Loan Estimator */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '14px' }}>
                Payment & Financing Calculator
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Down payment */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: '#4b5563' }}>Down Payment ({downPaymentPercent}%)</span>
                    <span style={{ fontWeight: 700 }}>${downPaymentAmount.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50}
                    step={5}
                    value={downPaymentPercent}
                    onChange={e => setDownPaymentPercent(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                  />
                </div>

                {/* Term */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: '#4b5563' }}>Loan Term</span>
                    <span style={{ fontWeight: 700 }}>{loanTermMonths} Months</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                    {[36, 48, 60, 72].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setLoanTermMonths(t)}
                        style={{
                          padding: '7px 4px',
                          borderRadius: 'var(--radius-sm)',
                          border: loanTermMonths === t ? '1px solid var(--accent-purple)' : '1px solid #e5e7eb',
                          background: loanTermMonths === t ? 'var(--accent-purple)' : '#f9fafb',
                          color: loanTermMonths === t ? '#ffffff' : '#374151',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                        }}
                      >
                        {t} mo
                      </button>
                    ))}
                  </div>
                </div>

                {/* APR rate */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                    <span style={{ color: '#4b5563' }}>Estimated Interest Rate</span>
                    <span style={{ fontWeight: 700 }}>{interestRate}% APR</span>
                  </div>
                  <input
                    type="range"
                    min={3.5}
                    max={12.0}
                    step={0.5}
                    value={interestRate}
                    onChange={e => setInterestRate(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                  />
                </div>

                {/* Result box */}
                <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-md)', padding: '14px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Estimated Monthly Payment</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                    ${monthlyPayment}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#6b7280' }}>/mo</span>
                  </span>
                </div>

                <Link
                  to="/finance"
                  className="btn btn-secondary"
                  style={{ textAlign: 'center', width: '100%', fontSize: '0.85rem', padding: '10px' }}
                >
                  Apply for Pre-Qualification (No Credit Hit)
                </Link>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
                Reserve & Secure This Vehicle
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setCheckoutVehicle(vehicle)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.92rem', fontWeight: 700 }}
                >
                  <ShoppingBag size={17} /> Reserve Vehicle with $500 Deposit
                </button>

                <button
                  onClick={() => setIsTestDriveOpen(true)}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '11px', fontSize: '0.9rem' }}
                >
                  <Calendar size={17} /> Schedule Virtual Video Walkthrough
                </button>

                <Link
                  to="/sell"
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '11px', fontSize: '0.9rem', textAlign: 'center', textDecoration: 'none' }}
                >
                  <DollarSign size={17} /> Trade In Your Current Vehicle
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Test Drive Consultation Modal */}
        {isTestDriveOpen && (
          <div className="modal-backdrop" onClick={() => setIsTestDriveOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '24px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
                Schedule Virtual Walkthrough
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '18px' }}>
                Our VIP advisor will conduct a live HD video walkaround of this {vehicle.name}, cold-start the engine, and review title documentation.
              </p>

              {testDriveConfirmed ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#059669' }}>
                  <CheckCircle size={44} style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Walkthrough Booked!</h4>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '6px' }}>
                    Our sales advisor will contact you within 30 minutes via FaceTime or Google Meet.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleTestDriveSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="Jane Doe"
                      value={testDriveName}
                      onChange={e => setTestDriveName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="input"
                      placeholder="(555) 000-0000"
                      value={testDrivePhone}
                      onChange={e => setTestDrivePhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Preferred Date & Time</label>
                    <input
                      type="datetime-local"
                      className="input"
                      value={testDriveDate}
                      onChange={e => setTestDriveDate(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                    <button type="button" onClick={() => setIsTestDriveOpen(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Confirm Appointment
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Similar Vehicles */}
        {relatedVehicles.length > 0 && (
          <div style={{ marginTop: '48px' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
              Similar Bank Repossessed Vehicles
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              {relatedVehicles.map(rel => (
                <VehicleCard key={rel.id} vehicle={rel} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
