import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  Star,
  CheckCircle,
  Quote,
  Award,
} from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews } = useStore();

  return (
    <section id="reviews-section" style={{ padding: '60px 0 80px', background: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 48px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Customer Feedback
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginTop: '4px', marginBottom: '10px' }}>
            What Real Car Buyers Say About Us
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Verified reviews from customers across the United States who bought used and brand new vehicles through our direct marketplace.
          </p>

          {/* Rating Pill */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-full)', padding: '8px 20px', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={17} fill="#f59e0b" color="#f59e0b" />
              ))}
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#111827' }}>4.9 out of 5</span>
            <div style={{ width: '1px', height: '14px', background: '#d1d5db' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {reviews.length} Verified Reviews
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {reviews.map((review, idx) => (
            <div
              key={review.id || idx}
              className="card-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
              }}
            >
              <div>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '2px', marginBottom: '12px' }}>
                  {Array.from({ length: review.rating || 5 }).map((_, i) => (
                    <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                {/* Review Body */}
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#374151', marginBottom: '16px' }}>
                  "{review.body}"
                </p>
              </div>

              {/* Author */}
              <div style={{ borderTop: '1px solid #f1f3f5', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{review.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {review.location || 'United States'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600 }}>
                  <CheckCircle size={14} />
                  Verified Buyer
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
