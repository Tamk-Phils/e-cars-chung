import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  Clock,
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  Search,
  Tag,
} from 'lucide-react';

export const ResearchPage: React.FC = () => {
  const { posts } = useStore();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(p => {
    if (activeCategory !== 'all' && p.category.toLowerCase() !== activeCategory.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchExcerpt = p.excerpt.toLowerCase().includes(q);
      const matchContent = p.content.toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchContent) return false;
    }
    return true;
  });

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ background: '#f7f7f8', minHeight: '85vh', padding: '36px 0 80px' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>Research & Buyer Guides</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Automotive Knowledge Hub
          </span>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.025em', marginTop: '4px', marginBottom: '10px' }}>
            Buyer Guides, Market Research & Advice
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.6 }}>
            In-depth guides transferred from certified automotive appraisers. Master the nuances of clean titles, repo auctions, financing calculations, and avoiding online vehicle scams.
          </p>

          {/* Search bar */}
          <div style={{ position: 'relative', maxWidth: '480px', margin: '24px auto 0' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
            <input
              type="text"
              className="input"
              placeholder="Search guides, salvage titles, repo laws..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '42px', height: '46px', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                border: activeCategory === cat ? '1px solid var(--accent-purple)' : '1px solid #d1d5db',
                background: activeCategory === cat ? 'var(--accent-purple)' : '#ffffff',
                color: activeCategory === cat ? '#ffffff' : '#374151',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat === 'all' ? `All Articles (${posts.length})` : cat}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
          {filteredPosts.map(post => (
            <article
              key={post.id}
              className="card-panel"
              onClick={() => navigate(`/research/${post.id}`)}
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ height: '200px', background: '#e5e7eb', overflow: 'hidden' }}>
                <img
                  src={post.cover_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
                      {post.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {post.read_minutes} min read
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '8px', lineHeight: 1.35 }}>
                    {post.title}
                  </h2>

                  <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '16px' }}>
                    {post.excerpt}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#6b7280' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <span style={{ color: 'var(--accent-purple)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read Guide <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

