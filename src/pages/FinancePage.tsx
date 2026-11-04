import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  DollarSign,
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  Calculator,
  Lock,
  Sparkles,
  Award,
} from 'lucide-react';

export const FinancePage: React.FC = () => {
  const { formatPrice } = useStore();

  // Calculator inputs
  const [carPrice, setCarPrice] = useState(65000);
  const [downPayment, setDownPayment] = useState(10000);
  const [tradeInValue, setTradeInValue] = useState(5000);
  const [loanTerm, setLoanTerm] = useState(60);
  const [apr, setApr] = useState(5.99);

  // Pre-qualification form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [annualIncome, setAnnualIncome] = useState('$85,000');
  const [creditTier, setCreditTier] = useState('prime');
  const [preQualSubmitted, setPreQualSubmitted] = useState(false);
  const [preQualResult, setPreQualResult] = useState<{ amount: number; rate: number } | null>(null);

  // Compute loan
  const principal = Math.max(0, carPrice - downPayment - tradeInValue);
  const monthlyRate = (apr / 100) / 12;
  const monthlyPayment = principal > 0
    ? Math.round((principal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) / (Math.pow(1 + monthlyRate, loanTerm) - 1))
    : 0;
  const totalCost = Math.round(monthlyPayment * loanTerm + downPayment + tradeInValue);
  const totalInterest = Math.max(0, totalCost - carPrice);

  const handlePreQualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = creditTier === 'super' ? 4.89 : creditTier === 'prime' ? 5.99 : creditTier === 'near' ? 8.49 : 11.99;
    const approvedAmount = Math.min(carPrice + 20000, 150000);
    setPreQualResult({ amount: approvedAmount, rate });
    setPreQualSubmitted(true);
  };

  return (
    <div style={{ background: '#f7f7f8', minHeight: '85vh', padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>Auto Financing & Loan Center</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Competitive Rates & Direct Lending
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', marginTop: '4px', marginBottom: '10px' }}>
            Auto Financing & Loan Payment Estimator
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Calculate monthly payments, compare APR rates by credit score, or apply for instant pre-qualification without impacting your credit score.
          </p>
        </div>

        {/* Main 2-Column: Loan Calculator + Tier Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '48px', alignItems: 'start' }} className="finance-grid">
          {/* Calculator Card */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ede9fe', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calculator size={20} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Payment Calculator
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                  Vehicle Price: ${carPrice.toLocaleString()}
                </label>
                <input
                  type="range"
                  min={15000}
                  max={250000}
                  step={2500}
                  value={carPrice}
                  onChange={e => setCarPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Cash Down Payment
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={downPayment}
                    onChange={e => setDownPayment(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Trade-In Equity
                  </label>
                  <input
                    type="number"
                    className="input"
                    value={tradeInValue}
                    onChange={e => setTradeInValue(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                  Loan Term: {loanTerm} Months
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {[36, 48, 60, 72].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setLoanTerm(t)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: 'var(--radius-sm)',
                        border: loanTerm === t ? '1px solid var(--accent-purple)' : '1px solid #e5e7eb',
                        background: loanTerm === t ? 'var(--accent-purple)' : '#f9fafb',
                        color: loanTerm === t ? '#ffffff' : '#374151',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                      }}
                    >
                      {t} mo
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                  <span>Interest Rate (APR)</span>
                  <span style={{ color: 'var(--accent-purple)' }}>{apr}%</span>
                </div>
                <input
                  type="range"
                  min={3.0}
                  max={14.0}
                  step={0.25}
                  value={apr}
                  onChange={e => setApr(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-purple)' }}
                />
              </div>

              {/* Payment Summary Box */}
              <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Estimated Monthly Payment</span>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-purple)', lineHeight: 1.15, display: 'block', margin: '6px 0' }}>
                  ${monthlyPayment.toLocaleString()}
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: '#6b7280' }}>/mo</span>
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '0.75rem', color: '#4b5563', borderTop: '1px solid #ddd6fe', paddingTop: '12px', marginTop: '12px' }}>
                  <div>
                    <span style={{ display: 'block', color: '#9ca3af' }}>Principal</span>
                    <strong>${principal.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', color: '#9ca3af' }}>Total Interest</span>
                    <strong>${totalInterest.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ display: 'block', color: '#9ca3af' }}>Total Amount</span>
                    <strong>${totalCost.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Credit Tier Reference Guide */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                Estimated Rates by Credit Score
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '18px' }}>
                Our network of 30+ prime and subprime lenders ensures competitive approval terms.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div
                  onClick={() => { setApr(4.89); setCreditTier('super'); }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: creditTier === 'super' ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                    background: creditTier === 'super' ? '#f5f3ff' : '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#111827' }}>Super Prime (780+)</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Best rates, zero down options</div>
                  </div>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.05rem' }}>4.89%</span>
                </div>

                <div
                  onClick={() => { setApr(5.99); setCreditTier('prime'); }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: creditTier === 'prime' ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                    background: creditTier === 'prime' ? '#f5f3ff' : '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#111827' }}>Prime (660 – 779)</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Standard tier, fast approval</div>
                  </div>
                  <span style={{ fontWeight: 800, color: '#059669', fontSize: '1.05rem' }}>5.99%</span>
                </div>

                <div
                  onClick={() => { setApr(8.49); setCreditTier('near'); }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: creditTier === 'near' ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                    background: creditTier === 'near' ? '#f5f3ff' : '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#111827' }}>Near Prime (600 – 659)</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Flexible terms, minor blemishes</div>
                  </div>
                  <span style={{ fontWeight: 800, color: '#d97706', fontSize: '1.05rem' }}>8.49%</span>
                </div>

                <div
                  onClick={() => { setApr(11.99); setCreditTier('rebuilding'); }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: creditTier === 'rebuilding' ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                    background: creditTier === 'rebuilding' ? '#f5f3ff' : '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#111827' }}>Rebuilding Credit (&lt;600)</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Second chance lending network</div>
                  </div>
                  <span style={{ fontWeight: 800, color: '#e11d48', fontSize: '1.05rem' }}>11.99%</span>
                </div>
              </div>
            </div>

            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: 800, marginBottom: '6px' }}>
                <ShieldCheck size={20} />
                <span>Zero Impact Soft Credit Inquiry</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#065f46', lineHeight: 1.5 }}>
                Checking your pre-qualified rates does not generate a hard inquiry on your credit report. Your credit score will not drop.
              </p>
            </div>
          </div>
        </div>

        {/* Pre-Qualification Application Section */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', padding: '36px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 28px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
              Instant Online Pre-Approval
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
              Get Pre-Qualified in 60 Seconds
            </h2>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Unlock your personalized interest rate and approved borrowing budget before reserving your vehicle.
            </p>
          </div>

          {preQualSubmitted && preQualResult ? (
            <div style={{ textAlign: 'center', padding: '32px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#059669', color: '#fff', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={32} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
                Congratulations, {fullName || 'Customer'}! You Are Pre-Qualified!
              </h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', margin: '20px 0' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Pre-Approved Budget</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                    ${preQualResult.amount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Qualified APR Rate</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669' }}>
                    {preQualResult.rate}%
                  </span>
                </div>
              </div>
              <p style={{ color: '#4b5563', fontSize: '0.85rem', maxWidth: '480px', margin: '0 auto 24px' }}>
                Your certificate has been sent to <strong>{email}</strong>. This approval is valid for 30 days and applies to any brand new or pre-owned car in our inventory.
              </p>
              <Link to="/inventory" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                Browse Inventory With Pre-Approved Financing
              </Link>
            </div>
          ) : (
            <form onSubmit={handlePreQualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="Jane Smith"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    className="input"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    className="input"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Estimated Annual Income *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="$85,000"
                    value={annualIncome}
                    onChange={e => setAnnualIncome(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#6b7280', marginTop: '6px' }}>
                <Lock size={14} style={{ color: '#059669' }} />
                <span>256-bit bank-grade SSL encryption. We never sell your personal information.</span>
              </div>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '12px 36px', fontSize: '0.95rem', fontWeight: 700 }}
                >
                  Submit Soft Pre-Qualification Application
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

