import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Sales & Vehicle Reservation Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the $500 refundable online hold work?',
      a: 'When you find a vehicle you love, you can place a $500 reservation deposit directly on the site. This locks down the vehicle exclusively in your name for 72 hours, preventing any other buyer from purchasing it. During this window, you can finalize financing, review the inspection report, or speak with our sales advisor. If you change your mind for ANY reason, the $500 is 100% refunded to your original payment method immediately with no cancellation penalties.',
    },
    {
      q: 'Are bank repossessed and seized vehicles guaranteed clean titles?',
      a: 'Yes. Every bank repossessed vehicle transferred to our lot has completed all legal lien satisfaction and repossession clearing protocols. We provide clean, transferable state titles or Manufacturer Statements of Origin (MSO) with verified zero liens or back taxes. You can register and insure the vehicle in any U.S. state or Canadian province without restrictions.',
    },
    {
      q: 'How does nationwide enclosed home delivery work?',
      a: 'We operate our own certified fleet of climate-controlled, enclosed transport carriers. Once full payment or escrow deposit is settled, our logistics team inspects the odometer and loads your vehicle. You receive real-time GPS tracking and 24-hour advance notice before the carrier pulls up directly to your driveway.',
    },
    {
      q: 'Can I trade in my current vehicle toward a purchase?',
      a: 'Absolutely! Use our online "Sell & Trade-In" appraisal tool to calculate your car\'s cash value in under 2 minutes. We will pick up your trade-in at the exact same moment we deliver your new vehicle, and apply the trade-in equity directly against your purchase to save you state sales tax.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept major credit cards (Visa, Mastercard, Amex for reservation deposits), direct domestic and international Bank Wire transfers (via FDIC-insured escrow), verified Cashier’s Checks, and major cryptocurrencies (USDC and USDT on Ethereum / Polygon).',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <div style={{ background: '#f7f7f8', minHeight: '85vh', padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1040px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>Showroom & Customer Support</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Get in Touch
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', marginTop: '4px', marginBottom: '10px' }}>
            We're Here to Assist Your Purchase
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6 }}>
            Have questions about vehicle specs, bank wire escrow, title registration, or scheduling a VIP showroom pickup? Our automotive concierge team is ready to help.
          </p>
        </div>

        {/* 2-Column: Info & Hours + Contact Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '32px', marginBottom: '56px', alignItems: 'start' }} className="contact-grid">
          {/* Info Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '18px' }}>
                Showroom & Operations HQ
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.9rem', color: '#4b5563' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <MapPin size={20} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#111827', display: 'block' }}>VIP Concierge Center:</strong>
                    9800 Wilshire Boulevard, Suite 400<br />
                    Beverly Hills, CA 90212, United States
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Phone size={20} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#111827', display: 'block' }}>Toll-Free Support Line:</strong>
                    1-800-849-2019 (24/7 Buyer Concierge)
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Mail size={20} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#111827', display: 'block' }}>Email Inquiries:</strong>
                    support@usedcars.com / sales@usedcars.com
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Clock size={20} style={{ color: 'var(--accent-purple)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#111827', display: 'block' }}>Operating Hours:</strong>
                    Mon – Fri: 8:00 AM – 8:00 PM EST<br />
                    Sat – Sun: 9:00 AM – 6:00 PM EST
                  </div>
                </div>
              </div>
            </div>

            {/* Nationwide delivery badge */}
            <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-purple)', fontWeight: 800, marginBottom: '8px' }}>
                <Truck size={22} />
                <span>Nationwide Enclosed Logistics</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5, margin: 0 }}>
                We deliver to all 50 U.S. states and Canadian provinces. VIP showroom pickups are welcome with 24 hours advance scheduling.
              </p>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', padding: '36px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Send an Inquiry Message
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '20px' }}>
              Our sales advisors typically respond within 15 to 30 minutes during business hours.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '36px 0', color: '#059669' }}>
                <CheckCircle size={44} style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Inquiry Received!</h4>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '6px' }}>
                  Thank you, {name}! Your message has been routed to our senior vehicle specialist. We will reply to <strong>{email}</strong> shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Full Name *</label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="Jane Doe"
                      value={name}
                      onChange={e => setName(e.target.value)}
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
                </div>

                <div className="contact-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Phone Number</label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Inquiry Topic *</label>
                    <select className="select" value={subject} onChange={e => setSubject(e.target.value)}>
                      <option value="Sales & Vehicle Reservation Inquiry">Sales & Vehicle Reservation</option>
                      <option value="Financing & Loan Pre-Approval">Financing & Loan Pre-Approval</option>
                      <option value="Trade-In & Cash Offer">Trade-In & Instant Cash Offer</option>
                      <option value="Delivery Status & Carrier Logistics">Delivery & Logistics</option>
                      <option value="Other / General Support">General Support</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    className="input"
                    placeholder="Tell us what vehicle or question you need assistance with..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '12px 28px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Send size={16} /> Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', padding: '36px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 28px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
              Common Questions
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      background: isOpen ? '#f9fafb' : '#ffffff',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      color: '#111827',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} style={{ color: 'var(--accent-purple)' }} /> : <ChevronDown size={18} style={{ color: '#9ca3af' }} />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', background: '#f9fafb', fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

