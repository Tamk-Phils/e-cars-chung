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
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { vehicles, posts, reviews, setFilters, formatPrice } = useStore();
  const navigate = useNavigate();

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Filter featured vehicles
  const featuredVehicles = vehicles.filter(v => v.is_featured || v.is_hot_deal).slice(0, 8);
  const brandNewCount = vehicles.filter(v => v.condition === 'Brand New').length;
  const repoCount = vehicles.filter(v => v.condition === 'Bank Seized / Repo' || v.is_hot_deal).length;
  const usedCount = vehicles.filter(v => v.condition === 'Used' || v.condition === 'Certified Pre-Owned').length;

  const handleCategoryClick = (condition: string) => {
    setFilters(prev => ({ ...prev, condition }));
    navigate(`/inventory?condition=${encodeURIComponent(condition)}`);
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

  return (
    <div style={{ background: '#f7f7f8' }}>
      {/* 1. Hero Search Section */}
      <Hero />

      {/* 2. Category Quick-Pills / Visual Navigation */}
      <section style={{ padding: '40px 0 20px', background: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Explore Our Curated Fleet
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
              Shop By Vehicle Category
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Category 1: Brand New 2026 */}
            <div
              onClick={() => handleCategoryClick('Brand New')}
              style={{
                background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                border: '1px solid #ddd6fe',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-purple)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={20} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent-purple)', background: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    {brandNewCount} In Stock
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
                  Brand New 2026 Models
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.45 }}>
                  Unregistered factory allocations with full manufacturer warranties: Porsche GT3 RS, Tesla Plaid, Escalade-V & more.
                </p>
              </div>
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-purple)' }}>
                <span>Browse New Cars</span>
                <ArrowRight size={15} />
              </div>
            </div>

            {/* Category 2: Certified Pre-Owned & Used */}
            <div
              onClick={() => handleCategoryClick('Used')}
              style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '1px solid #a7f3d0',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#059669', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669', background: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    {usedCount} In Stock
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
                  Certified Pre-Owned & Used
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.45 }}>
                  Thoroughly inspected vehicles with 150-point safety certifications, verified Carfax histories, and clean titles.
                </p>
              </div>
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#059669' }}>
                <span>Browse Certified Used</span>
                <ArrowRight size={15} />
              </div>
            </div>

            {/* Category 3: Bank Seized & Repos */}
            <div
              onClick={() => handleCategoryClick('Bank Seized / Repo')}
              style={{
                background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                border: '1px solid #fecdd3',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e11d48', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Flame size={20} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#e11d48', background: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                    {repoCount} Hot Deals
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
                  Bank Repos & Seized Cars
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.45 }}>
                  Direct liquidation units priced 20% to 40% below typical dealer book values with clear title transfers.
                </p>
              </div>
              <div style={{ marginTop: '18px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.85rem', color: '#e11d48' }}>
                <span>View Bank Repos</span>
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Vehicle Inventory Showcase */}
      <section style={{ padding: '60px 0', background: '#f7f7f8' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Handpicked Selections
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginTop: '4px' }}>
                Featured Vehicles on Sale
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Discover our newest arrivals, top luxury allocations, and verified repossession specials.
              </p>
            </div>

            <Link
              to="/inventory"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent-purple)',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              <span>View All {vehicles.length} Vehicles</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {featuredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} viewMode="grid" />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link
              to="/inventory"
              className="btn btn-secondary"
              style={{ padding: '12px 28px', fontSize: '0.95rem', fontWeight: 700 }}
            >
              Explore Full Vehicle Catalog ({vehicles.length} Units Available)
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us / Value Proposition */}
      <section style={{ padding: '60px 0', background: '#ffffff', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 48px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              The UsedCars.com Standard
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
              Why Buy Online With Confidence
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '8px' }}>
              Every car on our marketplace comes backed by transparent guarantees and end-to-end customer protection.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '28px' }}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#ede9fe', color: 'var(--accent-purple)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>$500 Refundable Hold</h3>
              <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5 }}>
                Lock in any vehicle for 72 hours before paying the balance. If you change your mind for any reason, your $500 is instantly returned.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#d1fae5', color: '#059669', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>150-Point Certified Inspection</h3>
              <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5 }}>
                ASE-certified master technicians rigorously inspect transmission, electricals, frame integrity, and brakes on every unit.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dbeafe', color: '#2563eb', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Truck size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Nationwide Enclosed Delivery</h3>
              <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5 }}>
                Delivered straight to your driveway or local pickup terminal in a climate-controlled enclosed carrier with real-time GPS tracking.
              </p>
            </div>

            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fef3c7', color: '#d97706', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DollarSign size={26} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '8px' }}>Fair Trade-In & Cash Buyout</h3>
              <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5 }}>
                Trade in your current vehicle with instant algorithmic appraisals, or sell directly to us with immediate bank wire payment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Sell / Trade-In CTA Banner */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Sell or Trade In
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginTop: '6px', marginBottom: '14px' }}>
                Get an Instant Cash Offer For Your Car Today
              </h2>
              <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Skip the dealership hassle. Enter your VIN or Year/Make/Model to unlock a guaranteed 7-day cash offer. We pick up from your home and wire payment directly to your account.
              </p>
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link
                  to="/sell"
                  style={{
                    background: 'var(--accent-purple)',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Value Your Car in 2 Minutes</span>
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/finance"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Explore Auto Financing
                </Link>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 'var(--radius-xl)', padding: '32px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: '#ffffff' }}>
                Instant Trade-In Valuation Calculator
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>Vehicle Year, Make, Model</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. 2021 Toyota RAV4 XSE"
                    style={{ background: '#374151', color: '#fff', border: '1px solid #4b5563' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>Estimated Mileage</label>
                  <input
                    type="text"
                    className="input"
                    placeholder="e.g. 35,000 miles"
                    style={{ background: '#374151', color: '#fff', border: '1px solid #4b5563' }}
                  />
                </div>
                <Link
                  to="/sell"
                  style={{
                    background: '#ffffff',
                    color: '#111827',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'block',
                    marginTop: '8px',
                  }}
                >
                  Calculate My Car's Value
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Research & Guides Preview */}
      <section style={{ padding: '60px 0', background: '#f7f7f8' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Buyer Resources & Legal Guides
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
                Car Buying Insights & Advice
              </h2>
            </div>
            <Link to="/research" style={{ color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View All 9 Guides</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {posts.slice(0, 3).map(post => (
              <div
                key={post.id}
                onClick={() => navigate(`/research/${post.id}`)}
                className="card-panel"
                style={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '180px', background: '#e5e7eb', overflow: 'hidden' }}>
                  <img
                    src={post.cover_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
                      {post.category}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827', marginTop: '6px', marginBottom: '8px', lineHeight: 1.35 }}>
                      {post.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.5 }}>
                      {post.excerpt.slice(0, 110)}...
                    </p>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#9ca3af' }}>
                    <span>{post.read_minutes} min read</span>
                    <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>Read Guide →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Verified Reviews Preview */}
      <section style={{ padding: '60px 0', background: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Customer Testimonials
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
                Rated 4.9 / 5 Stars by Verified Buyers
              </h2>
            </div>
            <Link to="/reviews" style={{ color: 'var(--accent-purple)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>View All {reviews.length} Reviews</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {reviews.slice(0, 3).map((rev, idx) => (
              <div
                key={rev.id || idx}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 'var(--radius-lg)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={15} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#374151', lineHeight: 1.55 }}>
                    "{rev.body}"
                  </p>
                </div>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{rev.name}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VIP Alerts & Newsletter */}
      <section style={{ padding: '60px 0', background: '#ede9fe' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '640px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-purple)', color: '#fff', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={22} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
            Get VIP Alerts on New Seized & Repo Deals
          </h2>
          <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
            Subscribe to our weekly drop alerts. Be the first to receive notifications when bank repossessions and 2026 factory allocations hit the lot.
          </p>

          <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '460px', margin: '0 auto' }}>
            <input
              type="email"
              required
              className="input"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={e => setNewsletterEmail(e.target.value)}
              style={{ flexGrow: 1, background: '#ffffff' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 24px', flexShrink: 0 }}>
              Subscribe
            </button>
          </form>

          {newsletterSuccess && (
            <div style={{ marginTop: '12px', color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
              ✓ You are subscribed! You'll receive VIP inventory alerts before public listings.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

