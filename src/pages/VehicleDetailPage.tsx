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
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { vehicles, formatPrice, toggleWishlist, isInWishlist, toggleCompare, isInCompare, setCheckoutVehicle } = useStore();
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
          The vehicle you requested may have been sold or removed from inventory.
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
        text: `Check out this ${vehicle.name} on UsedCars.com`,
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
    <div style={{ background: '#f7f7f8', minHeight: '90vh', padding: '24px 0 64px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link to="/inventory" style={{ color: '#6b7280', textDecoration: 'none' }}>Inventory</Link>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>{vehicle.name}</span>
        </div>

        {/* Top Header Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: vehicle.condition === 'Brand New' ? '#ede9fe' : vehicle.condition === 'Bank Seized / Repo' ? '#ffe4e6' : '#ecfdf5', color: vehicle.condition === 'Brand New' ? 'var(--accent-purple)' : vehicle.condition === 'Bank Seized / Repo' ? '#e11d48' : '#059669' }}>
                {vehicle.condition === 'Brand New' ? '🌟 Brand New 2026 Model' : vehicle.condition === 'Bank Seized / Repo' ? '🔥 Bank Repossession Deal' : '🛡️ Certified Inspected'}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: '#f3f4f6', color: '#374151' }}>
                VIN: {vehicle.vin}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: '#f3f4f6', color: '#374151' }}>
                Title: {vehicle.title_status}
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', margin: 0 }}>
              {vehicle.name}
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '4px' }}>
              {vehicle.trim || vehicle.model} • {vehicle.mileage} • {vehicle.exterior_color} Exterior
            </p>
          </div>

          {/* Pricing & Primary Action */}
          <div className="vehicle-detail-pricing" style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
              {formatPrice(vehicle.price)}
            </div>
            {vehicle.sale_price && (
              <div style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700 }}>
                Original MSRP: <span style={{ textDecoration: 'line-through', color: '#9ca3af' }}>{formatPrice(vehicle.sale_price + 8000)}</span>
              </div>
            )}
            <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '2px' }}>
              Est. ${monthlyPayment}/mo (${downPaymentPercent}% down, 60 mo)
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setCheckoutVehicle(vehicle)}
                className="btn btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.9rem', fontWeight: 700 }}
              >
                <ShoppingBag size={16} /> Hold For $500
              </button>
              <button
                onClick={() => toggleWishlist(vehicle.id)}
                className="btn btn-secondary"
                title="Save Vehicle"
                style={{ padding: '10px 14px' }}
              >
                <Heart size={16} fill={isFavorited ? '#ef4444' : 'none'} color={isFavorited ? '#ef4444' : 'currentColor'} />
              </button>
              <button
                onClick={() => toggleCompare(vehicle.id)}
                className="btn btn-secondary"
                title="Compare Vehicle"
                style={{ padding: '10px 14px', color: isCompared ? 'var(--accent-purple)' : 'inherit' }}
              >
                <Scale size={16} />
              </button>
              <button
                onClick={handleShare}
                className="btn btn-secondary"
                title="Share Vehicle"
                style={{ padding: '10px 14px' }}
              >
                {copiedLink ? <Check size={16} style={{ color: '#059669' }} /> : <Share2 size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Gallery + Specifications */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }} className="vehicle-details-layout">
          {/* Left Column: Photo Gallery + Overview */}
          <div>
            {/* Main Stage Image */}
            <div
              className="vehicle-gallery-stage"
              style={{
                background: '#000000',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                position: 'relative',
                height: '440px',
                marginBottom: '12px',
                border: '1px solid #e5e7eb',
              }}
            >
              <img
                src={images[activeImgIndex]}
                alt={vehicle.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImgIndex(prev => (prev - 1 + images.length) % images.length)}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
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
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '38px',
                      height: '38px',
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
                  bottom: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.75)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
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
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    style={{
                      width: '84px',
                      height: '56px',
                      flexShrink: 0,
                      borderRadius: 'var(--radius-sm)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: activeImgIndex === i ? '2px solid var(--accent-purple)' : '2px solid transparent',
                      opacity: activeImgIndex === i ? 1 : 0.7,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <img src={img} alt={`Angle ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}

            {/* Vehicle Description */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
                Vehicle Overview & Condition Report
              </h3>
              <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                {vehicle.description}
              </p>
            </div>

            {/* Features Checklist */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
                  Factory Features & Options
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
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
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    150-Point Safety & Mechanical Inspection
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                    Certified Passed All Requirements
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4b5563' }}>Powertrain & Transmission</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Pass</span>
                </div>
                <div style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4b5563' }}>Braking & ABS System</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Pass</span>
                </div>
                <div style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4b5563' }}>Frame & Unibody Integrity</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Clean</span>
                </div>
                <div style={{ padding: '10px 14px', background: '#f9fafb', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4b5563' }}>On-Board Diagnostics (OBD-II)</span>
                  <span style={{ color: '#059669', fontWeight: 700 }}>✓ Zero Codes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Technical Specs & Financing Estimator */}
          <div>
            {/* Complete Technical Specifications Grid */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
                Vehicle Specifications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Make</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.make}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Model</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.model}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Year</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.year}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Mileage</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.mileage}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Transmission</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.transmission}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Fuel Type</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.fuel_type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Drivetrain</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.drivetrain || 'All-Wheel Drive'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Engine</span>
                  <span style={{ fontWeight: 700, color: '#111827', textAlign: 'right', maxWidth: '60%' }}>{vehicle.engine || 'High Output V8 / Twin Turbo'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Exterior Color</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.exterior_color}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                  <span style={{ color: '#6b7280' }}>Interior Color</span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>{vehicle.interior_color}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ color: '#6b7280' }}>Title Status</span>
                  <span style={{ fontWeight: 700, color: '#059669' }}>{vehicle.title_status}</span>
                </div>
              </div>
            </div>

            {/* Interactive Dynamic Loan Estimator */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
                Payment & Financing Calculator
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Down payment */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
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
                          padding: '8px 4px',
                          borderRadius: 'var(--radius-sm)',
                          border: loanTermMonths === t ? '1px solid var(--accent-purple)' : '1px solid #e5e7eb',
                          background: loanTermMonths === t ? 'var(--accent-purple)' : '#f9fafb',
                          color: loanTermMonths === t ? '#ffffff' : '#374151',
                          fontWeight: 700,
                          fontSize: '0.8rem',
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ color: '#4b5563' }}>Estimated Interest Rate (APR)</span>
                    <span style={{ fontWeight: 700 }}>{interestRate}%</span>
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
                <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-md)', padding: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'block' }}>Estimated Monthly Payment</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                    ${monthlyPayment}
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#6b7280' }}>/month</span>
                  </span>
                </div>

                <Link
                  to="/finance"
                  className="btn btn-secondary"
                  style={{ textAlign: 'center', width: '100%', fontSize: '0.85rem' }}
                >
                  Apply for Pre-Qualification (No Credit Impact)
                </Link>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '14px' }}>
                Ready to Move Forward?
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => setCheckoutVehicle(vehicle)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  <ShoppingBag size={18} /> Reserve Vehicle with $500 Hold
                </button>

                <button
                  onClick={() => setIsTestDriveOpen(true)}
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
                >
                  <Calendar size={18} /> Schedule Virtual Test Drive
                </button>

                <Link
                  to="/sell"
                  className="btn btn-secondary"
                  style={{ width: '100%', padding: '12px', fontSize: '0.95rem', textAlign: 'center', textDecoration: 'none' }}
                >
                  <DollarSign size={18} /> Value Your Trade-In Toward This Car
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Test Drive Consultation Modal */}
        {isTestDriveOpen && (
          <div className="modal-backdrop" onClick={() => setIsTestDriveOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px', padding: '28px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                Schedule Virtual Walkthrough
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '20px' }}>
                Our VIP concierge will conduct an interactive, live HD video walkaround of this {vehicle.name}, start the engine, and answer all technical questions.
              </p>

              {testDriveConfirmed ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: '#059669' }}>
                  <CheckCircle size={44} style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Walkthrough Requested!</h4>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '6px' }}>
                    Our VIP advisor will contact you within 30 minutes to confirm your preferred video platform (FaceTime, Zoom, or Google Meet).
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
                      placeholder="Your full name"
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
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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

        {/* Related Vehicles Slider */}
        {relatedVehicles.length > 0 && (
          <div style={{ marginTop: '56px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: '20px' }}>
              Similar Vehicles You May Like
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
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

