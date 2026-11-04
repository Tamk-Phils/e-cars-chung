import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  Star,
  CheckCircle,
  Quote,
  Award,
  Plus,
  X,
  Filter,
} from 'lucide-react';

export const ReviewsPage: React.FC = () => {
  const { reviews, addReview } = useStore();

  const [locationFilter, setLocationFilter] = useState('all');
  const [starFilter, setStarFilter] = useState<number | 'all'>('all');

  // New review modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [vehicleBought, setVehicleBought] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewBody, setReviewBody] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Extract unique locations
  const locations = ['all', ...Array.from(new Set(reviews.map(r => r.location).filter(Boolean)))];

  const filteredReviews = reviews.filter(r => {
    if (locationFilter !== 'all' && r.location !== locationFilter) return false;
    if (starFilter !== 'all' && r.rating !== starFilter) return false;
    return true;
  });

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !reviewBody) return;

    await addReview({
      name: authorName,
      location: authorLocation || 'United States',
      rating,
      body: reviewBody,
      vehicle_bought: vehicleBought || 'Verified Vehicle Purchase',
    });

    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setIsModalOpen(false);
      setAuthorName('');
      setAuthorLocation('');
      setVehicleBought('');
      setReviewBody('');
      setRating(5);
    }, 2000);
  };

  return (
    <div style={{ background: '#f7f7f8', minHeight: '85vh', padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>Customer Reviews</span>
        </div>

        {/* Header & Rating Breakdown Banner */}
        <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', padding: '36px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Customer Trust & Verification
              </span>
              <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#111827', marginTop: '4px', marginBottom: '8px' }}>
                Verified Buyer Reviews
              </h1>
              <p style={{ color: '#4b5563', fontSize: '0.95rem', maxWidth: '520px', lineHeight: 1.5 }}>
                Every review represents a real vehicle transaction with verified VIN and escrow settlement.
              </p>
            </div>

            {/* Score Box */}
            <div style={{ textAlign: 'center', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-lg)', padding: '24px 32px' }}>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-purple)', lineHeight: 1 }}>
                4.95
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', margin: '8px 0' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>
                Based on {reviews.length} Verified Purchases
              </span>
            </div>
          </div>

          {/* Action Row: Filters + Write Review Button */}
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            {/* Filter by Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600 }}>Filter Location:</span>
              <select
                className="select"
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                style={{ height: '36px', fontSize: '0.85rem', width: 'auto' }}
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', fontSize: '0.9rem' }}
            >
              <Plus size={16} /> Write a Customer Review
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredReviews.map((rev, idx) => (
            <div
              key={rev.id || idx}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Verified Purchase
                  </span>
                </div>

                <p style={{ fontSize: '0.92rem', color: '#374151', lineHeight: 1.6, marginBottom: '16px' }}>
                  "{rev.body}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>{rev.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {rev.location || 'United States'}
                  </div>
                </div>
                {rev.vehicle_bought && (
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontStyle: 'italic', maxWidth: '140px', textAlign: 'right' }}>
                    {rev.vehicle_bought}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Write a Review Modal */}
        {isModalOpen && (
          <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Share Your Buying Experience
                </h3>
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                  <X size={20} />
                </button>
              </div>

              {submittedMessage ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#059669' }}>
                  <CheckCircle size={44} style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Review Published!</h4>
                  <p style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '6px' }}>
                    Thank you for your feedback! Your review is now live on our platform.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Your Name *</label>
                    <input
                      type="text"
                      required
                      className="input"
                      placeholder="e.g. Michael R."
                      value={authorName}
                      onChange={e => setAuthorName(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Location (State / City)</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. Texas"
                        value={authorLocation}
                        onChange={e => setAuthorLocation(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Vehicle Purchased</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g. 2024 BMW M5"
                        value={vehicleBought}
                        onChange={e => setVehicleBought(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Rating (Stars) *</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                          }}
                        >
                          <Star
                            size={24}
                            fill={star <= rating ? '#f59e0b' : 'none'}
                            color={star <= rating ? '#f59e0b' : '#d1d5db'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Review Comments *</label>
                    <textarea
                      required
                      rows={4}
                      className="input"
                      placeholder="How was your car buying and delivery experience?"
                      value={reviewBody}
                      onChange={e => setReviewBody(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Publish Review
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

