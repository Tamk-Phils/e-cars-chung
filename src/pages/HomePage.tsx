import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Hero } from '../components/Hero';
import { VehicleCard } from '../components/VehicleCard';
import {
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight,
  Truck,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  FileText,
  SlidersHorizontal,
  Mail,
  Award,
  PhoneCall,
  Calculator,
  Search,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  ThumbsUp,
  RotateCcw,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { vehicles, posts, reviews, setFilters, formatPrice, currency } = useStore();
  const navigate = useNavigate();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Quick Loan Calculator on Homepage
  const [calcPrice, setCalcPrice] = useState(9000);
  const [calcDown, setCalcDown] = useState(1000);
  const [calcTerm, setCalcTerm] = useState(48);
  const [calcInterest, setCalcInterest] = useState(6.5);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Filter top vehicles
  const hotDeals = vehicles.filter(v => v.price <= 8000).slice(0, 8);
  const luxuryVehicles = vehicles.filter(v => ['Mercedes-Benz', 'BMW', 'Audi', 'Lexus', 'Infiniti'].includes(v.make)).slice(0, 8);
  const suvAndTrucks = vehicles.filter(v => v.body_type === 'SUV' || v.body_type === 'Truck').slice(0, 8);

  // Calculate monthly payment for home calculator
  const loanPrincipal = Math.max(0, calcPrice - calcDown);
  const monthlyRate = calcInterest / 100 / 12;
  const monthlyEst =
    monthlyRate > 0 && calcTerm > 0
      ? (loanPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, calcTerm))) / (Math.pow(1 + monthlyRate, calcTerm) - 1)
      : loanPrincipal / (calcTerm || 1);

  // Unique makes count
  const makesMap = vehicles.reduce((acc, v) => {
    acc[v.make] = (acc[v.make] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topMakes = Object.entries(makesMap).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const handleMakeClick = (make: string) => {
    setFilters(prev => ({ ...prev, make, condition: 'all', bodyType: 'all', onlyHotDeals: false }));
    navigate(`/inventory?make=${encodeURIComponent(make)}`);
  };

  const handleCategoryNav = (filterUpdate: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...filterUpdate }));
    navigate('/inventory');
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterSuccess(false);
      setNewsletterEmail('');
    }, 4000);
  };

  const faqs = [
    {
      q: 'How does the 100% refundable $500 reservation hold work?',
      a: 'When you place a $500 hold on any vehicle, it is immediately marked as reserved and taken off the market for 7 business days. This gives you time to complete financing, test drive, or finalize insurance. If for any reason you decide not to proceed, your $500 is refunded to your original payment method with zero cancellation fees.'
    },
    {
      q: 'Can I get financing with fair, low, or establishing credit?',
      a: 'Yes! We partner with national banks, regional credit unions, and direct automotive lenders to offer competitive APR financing across all credit profiles. You can get soft pre-qualification on our Financing page without impacting your credit score.'
    },
    {
      q: 'How does nationwide enclosed home delivery work?',
      a: 'Once your purchase or hold agreement is finalized, your car is scheduled with our bonded and insured carrier fleet. It is transported in an enclosed trailer and delivered straight to your residential or office address, complete with temporary registration tags and title documents.'
    },
    {
      q: 'Are all vehicles certified and inspected?',
      a: 'Every car in our inventory undergoes a rigorous 150-point mechanical, structural, and computer diagnostics scan by certified technicians. Every car includes a verified Carfax vehicle history report, title guarantee, and a 90-day powertrain warranty.'
    },
    {
      q: 'Can I trade in my current vehicle or sell it for cash?',
      a: 'Absolutely. Use our instant Sell & Trade-in appraisal tool to get a transparent market evaluation in 2 minutes. We will pick up your trade-in right at your driveway when delivering your new car or issue an instant electronic bank transfer.'
    }
  ];

  return (
    <div style={{ background: '#f8fafc', color: '#0f172a' }}>
      {/* ─── 1. HERO SEARCH SECTION ────────────────────────────────────────── */}
      <Hero />

      {/* ─── 2. VALUE PROPOSITION BANNER ───────────────────────────────────── */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '24px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>150-Point Certified</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Clean title & full mechanical pass</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ede9fe', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <RotateCcw size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>7-Day Exchange Guarantee</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Love it or exchange it within 500 mi</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>Enclosed Home Delivery</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Doorstep delivery across 48 states</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <DollarSign size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>No Dealer Markups</div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Transparent out-the-door pricing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. TOP MAKES QUICK-SELECT CHIPS ───────────────────────────────── */}
      <section style={{ padding: '36px 0', background: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Shop by Popular Brand
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Select a manufacturer to view available dealer inventory
              </span>
            </div>
            <Link
              to="/inventory"
              style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-purple)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>View All 64 Cars</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'none' }}>
            {topMakes.map(([make, count]) => (
              <button
                key={make}
                onClick={() => handleMakeClick(make)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#1e293b',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--accent-purple-light)';
                  e.currentTarget.style.borderColor = 'var(--accent-purple)';
                  e.currentTarget.style.color = 'var(--accent-purple)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.color = '#1e293b';
                }}
              >
                <span>{make}</span>
                <span style={{ background: '#e2e8f0', color: '#475569', borderRadius: '10px', padding: '1px 6px', fontSize: '0.7rem' }}>
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. HOT DEALS UNDER $8,000 (REAL FORMER SITE INVENTORY) ────────── */}
      <section style={{ padding: '56px 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ffe4e6', color: '#e11d48', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '6px' }}>
                <Flame size={14} /> LIQUIDATION SPECIALS
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Hot Deals Under $8,000
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
                Clean title sedans and reliable daily drivers inspected and priced below market value.
              </p>
            </div>
            <Link
              to="/inventory?hotDeals=true"
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', fontWeight: 700, padding: '8px 18px', textDecoration: 'none' }}
            >
              <span>View All Hot Deals ({vehicles.filter(v => v.price <= 8000).length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {hotDeals.map(veh => (
              <VehicleCard key={veh.id} vehicle={veh} viewMode="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. HOW IT WORKS: 4 SIMPLE STEPS ───────────────────────────────── */}
      <section style={{ padding: '64px 0', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              The Modern Dealership Experience
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px', letterSpacing: '-0.02em' }}>
              How Buying With Chung Motors Works
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '8px' }}>
              From online discovery to driveway delivery, we eliminated dealership haggling, hidden paperwork fees, and uncertainty.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Step 1 */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent-purple)', color: '#fff', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(116, 39, 199, 0.25)' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Browse & Inspect Online
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55 }}>
                Explore 64 real vehicles with high-resolution photo galleries, complete mechanical specs, clean Carfax history reports, and verified VINs.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent-purple)', color: '#fff', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(116, 39, 199, 0.25)' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Instant Financing & Trade-In
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55 }}>
                Calculate monthly payments with live interest rates, check soft pre-qualification, and receive a binding 7-day trade appraisal in 2 minutes.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent-purple)', color: '#fff', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(116, 39, 199, 0.25)' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Reserve With $500 Escrow
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55 }}>
                Place a 100% refundable $500 escrow deposit. The car is immediately locked exclusively for you for 7 days while paperwork is generated.
              </p>
            </div>

            {/* Step 4 */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'var(--accent-purple)', color: '#fff', fontSize: '1.25rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 12px rgba(116, 39, 199, 0.25)' }}>
                4
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
                Doorstep Delivery & 7-Day Trial
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.55 }}>
                Your vehicle arrives on an insured carrier right to your driveway. Test drive for 7 days or 500 miles with complete peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. INTERACTIVE HOME PAYMENT ESTIMATOR WIDGET ──────────────────── */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '40px', alignItems: 'center' }} className="finance-grid">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, color: '#a78bfa', marginBottom: '12px' }}>
                <Calculator size={14} /> LIVE PAYMENT CALCULATOR
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
                Estimate Your Monthly Auto Payment
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Tailor your financing structure. Our flexible lending options make owning an inspected, clean-title vehicle affordable with no surprise dealer fees.
              </p>

              {/* Sliders */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    <span>Target Vehicle Price</span>
                    <span style={{ color: '#38bdf8' }}>{formatPrice(calcPrice)}</span>
                  </div>
                  <input
                    type="range"
                    min={2000}
                    max={30000}
                    step={500}
                    value={calcPrice}
                    onChange={e => setCalcPrice(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    <span>Down Payment</span>
                    <span style={{ color: '#38bdf8' }}>{formatPrice(calcDown)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={calcPrice * 0.5}
                    step={250}
                    value={calcDown}
                    onChange={e => setCalcDown(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                    <span>Loan Duration</span>
                    <span style={{ color: '#38bdf8' }}>{calcTerm} Months</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[36, 48, 60, 72].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setCalcTerm(t)}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          border: calcTerm === t ? '2px solid var(--accent-purple)' : '1px solid #334155',
                          background: calcTerm === t ? 'var(--accent-purple)' : '#1e293b',
                          color: '#ffffff',
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
              </div>
            </div>

            {/* Result Box */}
            <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-xl)', padding: '36px 30px', textAlign: 'center', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Estimated Monthly Payment
              </span>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#38bdf8', margin: '12px 0 6px', letterSpacing: '-0.03em' }}>
                ${Math.round(monthlyEst)}
                <span style={{ fontSize: '1.1rem', color: '#94a3b8', fontWeight: 600 }}>/mo</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '24px' }}>
                Based on ${loanPrincipal.toLocaleString()} financed over {calcTerm} months at {calcInterest}% APR
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  to="/finance"
                  className="btn btn-primary"
                  style={{ padding: '12px 20px', fontSize: '0.92rem', fontWeight: 800, textDecoration: 'none' }}
                >
                  <span>Apply for Instant Pre-Approval</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={`/inventory?maxPrice=${calcPrice}`}
                  style={{ color: '#cbd5e1', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'underline' }}
                >
                  View Cars Under {formatPrice(calcPrice)} ({vehicles.filter(v => v.price <= calcPrice).length} Available)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. LUXURY & PERFORMANCE SHOWCASE ──────────────────────────────── */}
      <section style={{ padding: '60px 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#ede9fe', color: 'var(--accent-purple)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '6px' }}>
                <Sparkles size={14} /> EXECUTIVE FLEET
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Luxury & Sport Performance
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
                Mercedes-Benz AMG, BMW M-Series, Audi S/A8, Lexus, and Infiniti luxury models.
              </p>
            </div>
            <Link
              to="/inventory"
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', fontWeight: 700, padding: '8px 18px', textDecoration: 'none' }}
            >
              <span>Explore All Vehicles</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {luxuryVehicles.map(veh => (
              <VehicleCard key={veh.id} vehicle={veh} viewMode="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. 150-POINT INSPECTION & PEACE OF MIND BREAKDOWN ──────────────── */}
      <section style={{ padding: '64px 0', background: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Dealership Certification
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
              Our 150-Point Quality Commitment
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '6px' }}>
              Every car must pass inspection before entering our sales lot.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}
          >
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Powertrain & Engine</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                Cylinder compression verification, fluid quality checks, cooling system pressure tests, and smooth automatic transmission gear engagement.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Brakes & Suspension</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                Minimum 6mm brake pad thickness required, rotor runout measurement, shock absorber dampening, ball joints, and tie-rod integrity.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Diagnostics & Electronics</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                Full OBD-II diagnostic computer scan for zero fault codes, alternator charging output, battery load test, and A/C climate efficiency.
              </p>
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <CheckCircle size={20} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>Title & History Guarantee</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                Free Carfax history report, verified odometer mileage, lien-free title certification, and complete DMV registration service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 9. VERIFIED CUSTOMER REVIEWS ──────────────────────────────────── */}
      <section style={{ padding: '60px 0', background: '#f8fafc' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} fill="#f59e0b" />
                ))}
                <span style={{ marginLeft: '4px', color: '#0f172a' }}>4.9 OUT OF 5 STARS</span>
              </div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                What Our Buyers Say
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '4px 0 0' }}>
                Verified customer experiences from purchases and nationwide deliveries.
              </p>
            </div>
            <Link
              to="/reviews"
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', fontWeight: 700, padding: '8px 18px', textDecoration: 'none' }}
            >
              <span>Read All Reviews ({reviews.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {reviews.slice(0, 3).map((rev, idx) => (
              <div
                key={rev.id || idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '3px', color: '#f59e0b', marginBottom: '12px' }}>
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={14} fill="#f59e0b" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '16px' }}>
                    "{rev.body}"
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{rev.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rev.location || 'Verified Buyer'}</div>
                  </div>
                  {rev.vehicle_bought && (
                    <span style={{ fontSize: '0.72rem', background: '#ede9fe', color: 'var(--accent-purple)', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                      {rev.vehicle_bought}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 10. FREQUENTLY ASKED QUESTIONS (ACCORDION) ────────────────────── */}
      <section style={{ padding: '64px 0', background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
              Clear Answers
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontWeight: 800,
                      fontSize: '0.94rem',
                      color: '#0f172a',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--accent-purple)" /> : <ChevronDown size={18} color="#94a3b8" />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 18px', fontSize: '0.88rem', color: '#475569', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 11. NEWSLETTER & VIP INVENTORY ALERTS ─────────────────────────── */}
      <section style={{ padding: '56px 0', background: 'var(--accent-purple)', color: '#ffffff' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '640px' }}>
          <Mail size={32} style={{ color: '#f3e8ff', margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, margin: 0 }}>
            Never Miss a Fresh Arrival or Price Drop
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#f3e8ff', marginTop: '8px', lineHeight: 1.6 }}>
            Subscribe to our weekly inventory bulletin. Get notified first when certified sedans, trucks, or specials hit our showroom lot.
          </p>

          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              style={{
                padding: '12px 18px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.9rem',
                minWidth: '280px',
                outline: 'none',
                color: '#0f172a',
              }}
            />
            <button
              type="submit"
              style={{
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Get Inventory Alerts
            </button>
          </form>

          {newsletterSuccess && (
            <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700 }}>
              ✓ You are subscribed! You will receive our next inventory catalog update.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
