import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { VehicleCard } from '../components/VehicleCard';
import {
  Clock,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  CheckCircle,
  Tag,
  BookOpen,
} from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { posts, vehicles } = useStore();
  const navigate = useNavigate();

  const post = posts.find(p => p.id === id || p.slug === id);

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px', background: '#f7f7f8' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
          Article Not Found
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem', marginBottom: '24px' }}>
          The requested guide or post could not be located.
        </p>
        <Link to="/research" className="btn btn-primary" style={{ padding: '10px 24px' }}>
          Back to Research & Guides
        </Link>
      </div>
    );
  }

  // Recommended vehicles based on keywords
  const recommendedVehicles = vehicles
    .filter(v => {
      if (post.category.toLowerCase().includes('repo') || post.slug.includes('repo')) {
        return v.condition === 'Bank Seized / Repo' || v.is_hot_deal;
      }
      if (post.category.toLowerCase().includes('guide') || post.slug.includes('clean')) {
        return v.condition === 'Certified Pre-Owned' || v.condition === 'Brand New';
      }
      return v.is_featured;
    })
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <div style={{ background: '#f7f7f8', minHeight: '85vh', padding: '32px 0 80px' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link
            to="/research"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-purple)',
              fontWeight: 700,
              fontSize: '0.85rem',
              textDecoration: 'none',
            }}
          >
            <ArrowLeft size={16} /> All Guides & Articles
          </Link>

          <button
            onClick={handleShare}
            className="btn btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Share2 size={14} /> Share
          </button>
        </div>

        {/* Article Container Card */}
        <article className="card-panel" style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', overflow: 'hidden', padding: '32px 20px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', marginBottom: '36px' }}>
          {/* Header Meta */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-purple)', background: '#ede9fe', padding: '4px 10px', borderRadius: 'var(--radius-full)', textTransform: 'uppercase' }}>
              {post.category}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {post.read_minutes} min read
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={14} /> {post.author}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.35rem, 5vw, 2.1rem)', fontWeight: 800, color: '#111827', lineHeight: 1.25, letterSpacing: '-0.025em', marginBottom: '16px' }}>
            {post.title}
          </h1>

          <div style={{ height: 'clamp(180px, 45vw, 360px)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', margin: '20px 0 28px' }}>
            <img
              src={post.cover_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'}
              alt={post.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Key Takeaways Callout Box */}
          <div style={{ background: '#f5f3ff', borderLeft: '4px solid var(--accent-purple)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
              Key Takeaways
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
              {post.excerpt}
            </p>
          </div>

          {/* Body Content */}
          <div style={{ fontSize: '1.05rem', lineHeight: 1.8, color: '#374151', whiteSpace: 'pre-line' }}>
            {post.content}
          </div>

          {/* Keywords / Tags */}
          {post.keywords && post.keywords.length > 0 && (
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px', marginTop: '36px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Related Topics:</span>
              {post.keywords.map((kw, i) => (
                <span key={i} style={{ fontSize: '0.75rem', background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Recommended Inventory Matching This Article */}
        {recommendedVehicles.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', marginBottom: '18px' }}>
              Recommended Vehicles Discussed in This Guide
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {recommendedVehicles.map(veh => (
                <VehicleCard key={veh.id} vehicle={veh} viewMode="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

