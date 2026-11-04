import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
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
  Send,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Share2,
} from 'lucide-react';

export const VehicleModal: React.FC = () => {
  const {
    selectedVehicle,
    setSelectedVehicle,
    setCheckoutVehicle,
    formatPrice,
    toggleWishlist,
    isInWishlist,
    toggleCompare,
    isInCompare,
  } = useStore();

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Financing calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [loanTermMonths, setLoanTermMonths] = useState(60);
  const [interestRate, setInterestRate] = useState(6.5);

  // Inquiry form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  if (!selectedVehicle) return null;

  const images = selectedVehicle.images && selectedVehicle.images.length > 0 ? selectedVehicle.images : [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'
  ];

  const isFavorited = isInWishlist(selectedVehicle.id);
  const isCompared = isInCompare(selectedVehicle.id);

  // Calculate dynamic loan payments
  const vehiclePrice = selectedVehicle.price;
  const downPaymentAmount = Math.round((vehiclePrice * downPaymentPercent) / 100);
  const loanPrincipal = Math.max(0, vehiclePrice - downPaymentAmount);
  const monthlyInterest = (interestRate / 100) / 12;
  const monthlyPayment = loanPrincipal > 0
    ? Math.round((loanPrincipal * (monthlyInterest * Math.pow(1 + monthlyInterest, loanTermMonths))) / (Math.pow(1 + monthlyInterest, loanTermMonths) - 1))
    : 0;

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryName('');
      setInquiryPhone('');
      setInquiryMessage('');
    }, 4000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedVehicle.name,
        text: `Check out this ${selectedVehicle.name} on UsedCars.com`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setSelectedVehicle(null)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '1080px', padding: 0 }}
      >
        {/* Sticky Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
              STOCK #{selectedVehicle.id.slice(-6).toUpperCase()}
            </span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              VIN: {selectedVehicle.vin}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleShare}
              title="Share Vehicle"
              className="btn btn-secondary"
              style={{ padding: '6px 10px' }}
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={() => setSelectedVehicle(null)}
              className="btn btn-secondary"
              style={{ padding: '6px 10px' }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '24px' }}>
          {/* Top Gallery and Quick Specs Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', marginBottom: '32px' }} className="modal-top-grid">
            {/* Gallery Column */}
            <div>
              {/* Main Image Lightbox View */}
              <div
                style={{
                  position: 'relative',
                  height: '380px',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  background: '#04070d',
                  marginBottom: '12px',
                }}
              >
                <img
                  src={images[activeImageIndex]}
                  alt={selectedVehicle.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80';
                  }}
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIndex(prev => (prev - 1 + images.length) % images.length)}
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0, 0, 0, 0.65)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex(prev => (prev + 1) % images.length)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'rgba(0, 0, 0, 0.65)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

                {/* Photo Count Pill */}
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0, 0, 0, 0.75)', color: '#fff', fontSize: '0.75rem', padding: '4px 10px', borderRadius: 'var(--radius-sm)', backdropFilter: 'blur(4px)' }}>
                  {activeImageIndex + 1} / {images.length} Photos
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{
                        width: '70px',
                        height: '50px',
                        flexShrink: 0,
                        borderRadius: 'var(--radius-sm)',
                        overflow: 'hidden',
                        border: activeImageIndex === idx ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                        background: '#04070d',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <img src={img} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Details & Purchase Column */}
            <div>
              {/* Badges */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                {selectedVehicle.condition === 'Brand New' ? (
                  <span className="badge badge-brand-new">
                    <Sparkles size={12} /> BRAND NEW {selectedVehicle.year}
                  </span>
                ) : selectedVehicle.is_hot_deal ? (
                  <span className="badge badge-hot-deal">
                    <Flame size={12} /> BANK REPO / HOT DEAL
                  </span>
                ) : (
                  <span className="badge badge-certified">
                    <CheckCircle size={12} /> CERTIFIED PRE-OWNED
                  </span>
                )}
                <span className="badge badge-used">
                  {selectedVehicle.title_status || 'Clean Title'}
                </span>
              </div>

              {/* Title & Trim */}
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, marginBottom: '6px', lineHeight: 1.25 }}>
                {selectedVehicle.name}
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {selectedVehicle.trim || `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`}
              </div>

              {/* Price Block */}
              <div style={{ background: 'var(--bg-secondary)', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                      Upfront Internet Price
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {formatPrice(selectedVehicle.price)}
                      </span>
                      {selectedVehicle.sale_price && (
                        <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {formatPrice(selectedVehicle.sale_price)}
                        </span>
                      )}
                    </div>
                  </div>

                  {selectedVehicle.down_payment && (
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Required Down</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        {formatPrice(selectedVehicle.down_payment)}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '6px' }}>
                  Instant Pre-Approval Available • ${monthlyPayment}/mo estimated payment
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <button
                  onClick={() => {
                    const v = selectedVehicle;
                    setSelectedVehicle(null);
                    setCheckoutVehicle(v);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                >
                  <ShoppingBag size={18} /> Reserve Vehicle Online ($500 Deposit)
                </button>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    onClick={() => toggleWishlist(selectedVehicle.id)}
                    className="btn btn-secondary"
                    style={{ padding: '10px' }}
                  >
                    <Heart size={16} fill={isFavorited ? '#f43f5e' : 'none'} color={isFavorited ? '#f43f5e' : 'inherit'} />
                    {isFavorited ? 'Saved to Favorites' : 'Save Vehicle'}
                  </button>

                  <button
                    onClick={() => toggleCompare(selectedVehicle.id)}
                    className="btn btn-secondary"
                    style={{ padding: '10px' }}
                  >
                    <Scale size={16} />
                    {isCompared ? 'In Compare List' : 'Add to Compare'}
                  </button>
                </div>
              </div>

              {/* Trust Guarantees */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} style={{ color: 'var(--accent-cyan)' }} />
                  150-Point Certified Inspection
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Truck size={16} style={{ color: '#60a5fa' }} />
                  Free Nationwide Enclosed Delivery
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RotateCcw size={16} style={{ color: '#34d399' }} />
                  7-Day / 250-Mile Money-Back
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} style={{ color: '#fbbf24' }} />
                  Clean Title Guaranteed
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Specifications Table */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Vehicle Specifications & Factory Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {[
                { label: 'Year & Make', val: `${selectedVehicle.year} ${selectedVehicle.make}` },
                { label: 'Model', val: selectedVehicle.model },
                { label: 'Body Style', val: selectedVehicle.body_type || 'Standard' },
                { label: 'Mileage', val: selectedVehicle.mileage || 'Low Mileage' },
                { label: 'Engine', val: selectedVehicle.engine || 'V6/I4 Powertrain' },
                { label: 'Transmission', val: selectedVehicle.transmission || 'Automatic' },
                { label: 'Drivetrain', val: selectedVehicle.drivetrain || 'All-Wheel Drive / RWD' },
                { label: 'Fuel Type', val: selectedVehicle.fuel_type || 'Gasoline' },
                { label: 'Exterior Color', val: selectedVehicle.exterior_color || 'Metallic Finish' },
                { label: 'Interior Color', val: selectedVehicle.interior_color || 'Premium Leather' },
                { label: 'Title Status', val: selectedVehicle.title_status || 'Clean Title' },
                { label: 'VIN', val: selectedVehicle.vin },
              ].map((spec, i) => (
                <div
                  key={i}
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {spec.label}
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {spec.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Features */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '28px', marginBottom: '32px' }} className="modal-desc-grid">
            {/* Description */}
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '12px' }}>
                Seller Description & Condition Notes
              </h3>
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  padding: '18px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  whiteSpace: 'pre-line',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                }}
              >
                {selectedVehicle.description}
              </div>

              {/* Standard Features Tags */}
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
                  Certified Vehicle Equipment
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedVehicle.features.map((feat, i) => (
                    <span
                      key={i}
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <CheckCircle size={12} style={{ color: 'var(--accent-cyan)' }} /> {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Interactive Financing Calculator */}
            <div
              style={{
                background: 'var(--bg-card)',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                height: 'fit-content',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Calculator size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Payment Estimator</h3>
              </div>

              {/* Monthly payment display */}
              <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Estimated Monthly</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                  ${monthlyPayment.toLocaleString()}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/mo</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>
                  ${loanPrincipal.toLocaleString()} financed • ${downPaymentAmount.toLocaleString()} down
                </span>
              </div>

              {/* Down Payment Slider */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span>Down Payment: {downPaymentPercent}%</span>
                  <span style={{ fontWeight: 700 }}>${downPaymentAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={downPaymentPercent}
                  onChange={e => setDownPaymentPercent(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                />
              </div>

              {/* Loan Term Selection */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '6px' }}>
                  Loan Term (Months)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  {[36, 48, 60, 72].map(term => (
                    <button
                      key={term}
                      onClick={() => setLoanTermMonths(term)}
                      style={{
                        padding: '6px 0',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: loanTermMonths === term ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
                        color: loanTermMonths === term ? '#000' : 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      {term} mo
                    </button>
                  ))}
                </div>
              </div>

              {/* Interest Rate */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                  <span>Estimated APR</span>
                  <span style={{ fontWeight: 700 }}>{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="2.9"
                  max="14.9"
                  step="0.5"
                  value={interestRate}
                  onChange={e => setInterestRate(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                />
              </div>

              {/* Fast Inquiry Mini Form */}
              <form onSubmit={handleInquirySubmit} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}>
                  Questions? Inquire with a Concierge
                </div>
                {inquirySubmitted ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#34d399', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', textAlign: 'center' }}>
                    <CheckCircle size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                    Inquiry sent! A specialist will contact you shortly.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      className="input"
                      required
                      value={inquiryName}
                      onChange={e => setInquiryName(e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number / WhatsApp"
                      className="input"
                      required
                      value={inquiryPhone}
                      onChange={e => setInquiryPhone(e.target.value)}
                    />
                    <button type="submit" className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '8px' }}>
                      <Send size={14} /> Request Video Walkthrough
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .modal-top-grid, .modal-desc-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
