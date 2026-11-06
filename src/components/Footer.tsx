import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  Car,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Lock,
  ArrowRight,
  Flame,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [subEmail, setSubEmail] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (subEmail) {
      setSubSuccess(true);
      setTimeout(() => setSubSuccess(false), 4000);
      setSubEmail('');
    }
  };

  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid #e5e7eb', padding: '56px 0 32px' }}>
      <div className="container">
        {/* Top Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '36px', marginBottom: '44px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#0a0a0a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
                  }}
                >
                  <Flame size={18} color="#3b82f6" fill="#3b82f6" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.025em' }}>
                  Chung Motors
                </span>
              </Link>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
              Chung Motors™ is your premier digital automotive dealership for verified brand new 2026 factory allocations, certified pre-owned vehicles, and bank repossessions.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
              <ShieldCheck size={16} /> 100% Clean Title & 72-Hour Hold Guarantee
            </div>
          </div>

          {/* Shop Vehicles */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#111827', marginBottom: '12px' }}>
              Shop Vehicles
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li>
                <Link to="/inventory" style={{ color: '#4b5563', textDecoration: 'none' }}>
                  Browse All Vehicles For Sale
                </Link>
              </li>
              <li>
                <Link to="/inventory?condition=Brand+New" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}>
                  ★ Brand New 2026 Models
                </Link>
              </li>
              <li>
                <Link to="/inventory?condition=Used" style={{ color: '#4b5563', textDecoration: 'none' }}>
                  Certified Pre-Owned & Used
                </Link>
              </li>
              <li>
                <Link to="/inventory?condition=Bank+Seized+/+Repo" style={{ color: '#e11d48', textDecoration: 'none', fontWeight: 600 }}>
                  🔥 Bank Repos & Hot Deals
                </Link>
              </li>
              <li>
                <Link to="/sell" style={{ color: '#4b5563', textDecoration: 'none' }}>
                  Sell or Trade-In Your Car
                </Link>
              </li>
              <li>
                <Link to="/finance" style={{ color: '#4b5563', textDecoration: 'none' }}>
                  Car Financing & Loan Estimator
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#111827', marginBottom: '12px' }}>
              Buyer Hub & Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <li>
                <Link to="/research" style={{ color: '#4b5563', textDecoration: 'none' }}>
                  Research & Buyer Guides
                </Link>
              </li>
              <li>
                <Link to="/reviews" style={{ color: '#4b5563', textDecoration: 'none' }}>
                  Verified Customer Reviews
                </Link>
              </li>
              <li>
                <Link to="/orders" style={{ color: '#4b5563', textDecoration: 'none' }}>
                  Track Order / Delivery Status
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: '#4b5563', textDecoration: 'none' }}>
                  Showroom & Customer Concierge
                </Link>
              </li>
              <li style={{ marginTop: '8px' }}>
                <Link
                  to="/admin"
                  style={{
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 700,
                  }}
                >
                  <Lock size={12} style={{ color: 'var(--accent-purple)' }} /> Admin Control Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Alerts */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#111827', marginBottom: '12px' }}>
              Price Drop & Repo Alerts
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#4b5563', marginBottom: '12px', lineHeight: 1.5 }}>
              Sign up for instant email alerts when new bank repossessions or factory allocations arrive.
            </p>

            {subSuccess ? (
              <div style={{ background: '#dcfce7', color: '#15803d', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                <CheckCircle size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                Subscribed for email alerts!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="email"
                  className="input"
                  placeholder="Enter email..."
                  required
                  value={subEmail}
                  onChange={e => setSubEmail(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '8px 12px', height: '40px' }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', height: '40px' }}>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.75rem',
            color: '#9ca3af',
          }}
        >
          <div>
            © {new Date().getFullYear()} Chung Motors™ LLC. All rights reserved. Clean Title & Online Hold Guaranteed.
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Do Not Sell My Info</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
