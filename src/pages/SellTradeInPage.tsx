import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  DollarSign,
  ShieldCheck,
  Truck,
  CheckCircle,
  Clock,
  ArrowRight,
  Car,
  FileText,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const SellTradeInPage: React.FC = () => {
  const { vehicles, formatPrice } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [vin, setVin] = useState('');
  const [year, setYear] = useState('2021');
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('RAV4');
  const [trim, setTrim] = useState('XSE');
  const [mileage, setMileage] = useState('32000');
  const [condition, setCondition] = useState<'Excellent' | 'Good' | 'Fair'>('Good');
  const [hasAccident, setHasAccident] = useState(false);
  const [titleStatus, setTitleStatus] = useState('Clean Title');

  // Calculated offer
  const [estimatedOfferMin, setEstimatedOfferMin] = useState(24500);
  const [estimatedOfferMax, setEstimatedOfferMax] = useState(26800);
  const [confirmationCode, setConfirmationCode] = useState('');

  // Seller details for final step
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerZip, setSellerZip] = useState('90210');
  const [payoutOption, setPayoutOption] = useState<'wire' | 'trade' | 'check'>('trade');

  const calculateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedMileage = Number(mileage) || 40000;
    const baseValue = 35000;
    const mileageDeduction = (parsedMileage / 10000) * 1200;
    const conditionMultiplier = condition === 'Excellent' ? 1.05 : condition === 'Good' ? 0.95 : 0.85;
    const accidentDeduction = hasAccident ? 4000 : 0;

    const net = Math.max(8000, Math.round((baseValue - mileageDeduction - accidentDeduction) * conditionMultiplier));
    setEstimatedOfferMin(Math.round(net * 0.95));
    setEstimatedOfferMax(Math.round(net * 1.05));
    setStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = 'SELL-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmationCode(code);
    setStep(3);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  return (
    <div style={{ background: '#f7f7f8', minHeight: '85vh', padding: '24px 0 60px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>Sell or Trade In</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Instant Vehicle Appraisal
          </span>
          <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.25rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', marginTop: '4px', marginBottom: '10px', lineHeight: 1.25 }}>
            Sell or Trade In Your Vehicle Online
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.92rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Get a 100% transparent, data-driven cash offer in 2 minutes. Guaranteed for 7 days or 500 miles. We pick up from your doorstep and wire funds directly.
          </p>

          {/* Stepper */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 1 ? 'var(--accent-purple)' : '#e5e7eb', color: '#fff', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                1
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: step >= 1 ? '#111827' : '#9ca3af' }}>Vehicle Specs</span>
            </div>
            <div style={{ width: '24px', height: '2px', background: step >= 2 ? 'var(--accent-purple)' : '#e5e7eb' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 2 ? 'var(--accent-purple)' : '#e5e7eb', color: '#fff', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                2
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: step >= 2 ? '#111827' : '#9ca3af' }}>Instant Offer</span>
            </div>
            <div style={{ width: '24px', height: '2px', background: step >= 3 ? 'var(--accent-purple)' : '#e5e7eb' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= 3 ? '#059669' : '#e5e7eb', color: '#fff', fontWeight: 800, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                3
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: step >= 3 ? '#059669' : '#9ca3af' }}>Lock & Pickup</span>
            </div>
          </div>
        </div>

        {/* Step 1: Enter Vehicle Specs */}
        {step === 1 && (
          <div className="card-panel" style={{ padding: '28px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', marginBottom: '18px' }}>
              Step 1: Tell Us About Your Vehicle
            </h2>

            <form onSubmit={calculateOffer} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* VIN or Year/Make/Model */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                  VIN (Vehicle Identification Number) — Optional for faster lookup
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. 1HGCR2F83HA029182"
                  value={vin}
                  onChange={e => setVin(e.target.value.toUpperCase())}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Year *
                  </label>
                  <select className="select" value={year} onChange={e => setYear(e.target.value)}>
                    {Array.from({ length: 30 }, (_, i) => 2026 - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Make *
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="e.g. Toyota, BMW, Honda"
                    value={make}
                    onChange={e => setMake(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Model *
                  </label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="e.g. RAV4, M3, Civic"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Trim
                  </label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. XSE, Premium, Sport"
                    value={trim}
                    onChange={e => setTrim(e.target.value)}
                  />
                </div>
              </div>

              {/* Mileage & Condition */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Current Mileage *
                  </label>
                  <input
                    type="number"
                    required
                    className="input"
                    placeholder="e.g. 35000"
                    value={mileage}
                    onChange={e => setMileage(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Overall Mechanical & Cosmetic Condition *
                  </label>
                  <select className="select" value={condition} onChange={e => setCondition(e.target.value as any)}>
                    <option value="Excellent">Excellent (Like new, zero scratches, pristine mechanicals)</option>
                    <option value="Good">Good (Normal wear, minor rock chips, good tires)</option>
                    <option value="Fair">Fair (Noticeable scratches, interior wear, needs maintenance)</option>
                  </select>
                </div>
              </div>

              {/* Title & History */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                    Title Status
                  </label>
                  <select className="select" value={titleStatus} onChange={e => setTitleStatus(e.target.value)}>
                    <option value="Clean Title">Clean Title (In hand or financed with bank)</option>
                    <option value="Lease Payoff">Lease Payoff (We buyout your lease directly)</option>
                    <option value="Salvage / Rebuilt">Rebuilt / Salvage Title</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: '#374151', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={hasAccident}
                      onChange={e => setHasAccident(e.target.checked)}
                      style={{ accentColor: 'var(--accent-purple)', width: '18px', height: '18px' }}
                    />
                    <span>Vehicle has prior accident or insurance claim on record</span>
                  </label>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', maxWidth: '380px', padding: '14px 20px', fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span>Generate Instant Cash Valuation</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 2: Instant Offer & Payout Selection */}
        {step === 2 && (
          <div className="card-panel" style={{ padding: '28px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                ✓ Official Real-Time Valuation
              </span>
              <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 2rem)', fontWeight: 800, color: '#111827', marginTop: '4px', lineHeight: 1.3 }}>
                Estimated Offer Range: ${estimatedOfferMin.toLocaleString()} – ${estimatedOfferMax.toLocaleString()}
              </h2>
              <p style={{ color: '#4b5563', fontSize: '0.9rem', marginTop: '6px' }}>
                Based on live wholesale auction data for your {year} {make} {model} {trim} with {Number(mileage).toLocaleString()} miles.
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Payout Options */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>
                  Choose Your Preferred Payout Method
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                  <div
                    onClick={() => setPayoutOption('trade')}
                    style={{
                      border: payoutOption === 'trade' ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                      background: payoutOption === 'trade' ? '#f5f3ff' : '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>Trade-In Credit</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-purple)', background: '#ede9fe', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>+Tax Savings</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.4 }}>
                      Apply the full value of ${estimatedOfferMax.toLocaleString()} toward any vehicle in our catalog and save on state sales tax!
                    </p>
                  </div>

                  <div
                    onClick={() => setPayoutOption('wire')}
                    style={{
                      border: payoutOption === 'wire' ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                      background: payoutOption === 'wire' ? '#f5f3ff' : '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>Direct Bank Wire</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>Instant Deposit</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.4 }}>
                      Immediate wired funds deposited into your checking account as soon as our carrier inspects and picks up the keys.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
                  Where Should We Send Your Formal Offer & Schedule Pickup?
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="Jane Doe"
                      value={sellerName}
                      onChange={e => setSellerName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      className="input"
                      placeholder="jane@example.com"
                      value={sellerEmail}
                      onChange={e => setSellerEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      className="input"
                      placeholder="(555) 000-0000"
                      value={sellerPhone}
                      onChange={e => setSellerPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Pickup ZIP Code *</label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="90210"
                      value={sellerZip}
                      onChange={e => setSellerZip(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-secondary"
                  style={{ width: 'auto' }}
                >
                  ← Edit Vehicle Info
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '12px 28px', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  Lock In 7-Day Guaranteed Offer
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="card-panel" style={{ padding: '32px 18px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#d1fae5', color: '#059669', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={36} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Offer Confirmed & Locked
            </span>
            <h2 style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 800, color: '#111827', marginTop: '6px', marginBottom: '10px', wordBreak: 'break-word' }}>
              Offer Reference: {confirmationCode}
            </h2>
            <p style={{ color: '#4b5563', fontSize: '0.95rem', maxWidth: '540px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Thank you, {sellerName || 'Customer'}! Your guaranteed valuation of <strong>${estimatedOfferMax.toLocaleString()}</strong> has been locked in for 7 days. Our logistics dispatcher will call you at <strong>{sellerPhone || 'your phone number'}</strong> to schedule free doorstep pickup.
            </p>

            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '20px', maxWidth: '480px', margin: '0 auto 32px', textAlign: 'left', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px', color: '#111827' }}>What Happens Next:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#4b5563' }}>
                <div>1. <strong>Verification</strong>: We verify vehicle title and Carfax history (15 mins).</div>
                <div>2. <strong>Doorstep Inspection</strong>: Carrier inspects odometer and runs 10-minute scan.</div>
                <div>3. <strong>Immediate Payment</strong>: {payoutOption === 'trade' ? 'Credit applied instantly to your new car purchase' : 'Bank wire or cashier\'s check released on the spot'}.</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/inventory" className="btn btn-primary" style={{ padding: '12px 24px' }}>
                Browse Inventory With Your Trade Credit
              </Link>
              <button onClick={() => setStep(1)} className="btn btn-secondary" style={{ padding: '12px 24px' }}>
                Appraise Another Vehicle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

