import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Post } from '../types';
import {
  Clock,
  Calendar,
  User,
  ArrowRight,
  X,
  BookOpen,
} from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { posts, selectedPost, setSelectedPost, vehicles, setSelectedVehicle } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section id="blog-section" style={{ padding: '60px 0 80px', background: '#f7f7f8', borderTop: '1px solid #e5e7eb' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Research & Car Buying Advice
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', marginTop: '4px' }}>
              Latest Automotive News & Buyer Guides
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '640px' }}>
              Expert advice on vehicle inspections, clean titles, repossession auctions, and financing options.
            </p>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  border: activeCategory === cat ? '1px solid var(--accent-purple)' : '1px solid #d1d5db',
                  background: activeCategory === cat ? 'var(--accent-purple)' : '#ffffff',
                  color: activeCategory === cat ? '#ffffff' : 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat === 'all' ? 'All Articles' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="card-panel"
              onClick={() => setSelectedPost(post)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                cursor: 'pointer',
                background: '#ffffff',
              }}
            >
              <div style={{ height: '200px', background: '#e5e7eb', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={post.cover_image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'}
                  alt={post.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#ffffff',
                    color: '#111827',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  {post.category}
                </span>
              </div>

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <span>{formatDate(post.published_at)}</span>
                    <span>•</span>
                    <span>{post.read_minutes || 5} min read</span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: '#111827',
                      marginBottom: '10px',
                      lineHeight: 1.35,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginBottom: '16px',
                    }}
                  >
                    {post.excerpt}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f3f5', paddingTop: '12px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    By {post.author || 'Cars.com Editorial'}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read article <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Modal */}
      {selectedPost && (
        <div className="modal-backdrop" onClick={() => setSelectedPost(null)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '820px', padding: 0 }}
          >
            <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-brand-new">{selectedPost.category}</span>
              <button onClick={() => setSelectedPost(null)} className="btn btn-secondary" style={{ padding: '6px 10px' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '32px 32px 48px' }}>
              {selectedPost.cover_image && (
                <div style={{ height: '320px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '24px' }}>
                  <img src={selectedPost.cover_image} alt={selectedPost.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#111827', marginBottom: '14px', lineHeight: 1.25 }}>
                {selectedPost.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.85rem', color: 'var(--text-muted)', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '24px' }}>
                <span>By <strong>{selectedPost.author || 'Cars.com Editorial'}</strong></span>
                <span>•</span>
                <span>{formatDate(selectedPost.published_at)}</span>
                <span>•</span>
                <span>{selectedPost.read_minutes || 5} min read</span>
              </div>

              <div
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.8,
                  color: '#374151',
                  whiteSpace: 'pre-line',
                }}
              >
                {selectedPost.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
