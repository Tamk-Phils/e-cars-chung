import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  User as UserIcon,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginUser,
    registerUser,
    setIsChatOpen,
  } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        const res = await loginUser(email, password);
        if (!res.success) {
          setError(res.message || 'Login failed');
          setLoading(false);
          return;
        }
        setSuccessMsg('Welcome back! Signed in successfully.');
        setTimeout(() => {
          setSuccessMsg('');
          setIsChatOpen(true);
        }, 600);
      } else {
        if (!name.trim()) {
          setError('Please provide your full legal name');
          setLoading(false);
          return;
        }
        const res = await registerUser(name, email, phone, password);
        if (!res.success) {
          setError(res.message || 'Registration failed');
          setLoading(false);
          return;
        }
        setSuccessMsg('Account created successfully! Welcome to Chung Motors.');
        setTimeout(() => {
          setSuccessMsg('');
          setIsChatOpen(true);
        }, 600);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string) => {
    setError('');
    setEmail(demoEmail);
    const res = await loginUser(demoEmail);
    if (res.success) {
      setIsChatOpen(true);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsAuthModalOpen(false)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '440px', width: '92%', padding: '28px 24px', borderRadius: 'var(--radius-xl)' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--accent-purple)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserIcon size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.2 }}>
                {authModalMode === 'login' ? 'Customer Sign In' : 'Create Buyer Account'}
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Required for real-time concierge chat & order tracking
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Live Chat Prompt Notice */}
        <div
          style={{
            background: '#f5f3ff',
            border: '1px solid #ddd6fe',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <MessageCircle size={20} color="var(--accent-purple)" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#4b5563', lineHeight: 1.4 }}>
            Sign in or register in 30 seconds to initiate a direct live chat session with our dealership concierge.
          </p>
        </div>

        {/* Tabs: Sign In vs Create Account */}
        <div
          style={{
            display: 'flex',
            background: '#f3f4f6',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '20px',
            gap: '4px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: authModalMode === 'login' ? '#ffffff' : 'transparent',
              color: authModalMode === 'login' ? '#111827' : '#6b7280',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: authModalMode === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '8px 12px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: authModalMode === 'register' ? '#ffffff' : 'transparent',
              color: authModalMode === 'register' ? '#111827' : '#6b7280',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: authModalMode === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: '#d1fae5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle size={16} /> {successMsg}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authModalMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <UserIcon size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#9ca3af' }} />
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. Michael Reed"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px', fontSize: '0.875rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              Email Address *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#9ca3af' }} />
              <input
                type="email"
                required
                className="input"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ paddingLeft: '38px', height: '42px', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Phone Number (Optional)
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#9ca3af' }} />
                <input
                  type="tel"
                  className="input"
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  style={{ paddingLeft: '38px', height: '42px', fontSize: '0.875rem' }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: '#9ca3af' }} />
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ paddingLeft: '38px', height: '42px', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              height: '44px',
              fontSize: '0.92rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '4px',
            }}
          >
            {loading ? (
              'Processing...'
            ) : authModalMode === 'login' ? (
              <>
                <span>Sign In & Open Live Chat</span>
                <ArrowRight size={16} />
              </>
            ) : (
              <>
                <span>Create Account & Start Chat</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', marginBottom: '8px', textAlign: 'center' }}>
            Instant Demo Account Sign In:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => handleQuickDemo('michael.reed@example.com')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              Michael Reed
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('sarah.j@example.com')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              Sarah Jenkins
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('david.kim@example.com')}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '6px 10px' }}
            >
              David Kim
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontSize: '0.72rem',
            color: '#9ca3af',
            marginTop: '16px',
          }}
        >
          <ShieldCheck size={14} color="#059669" />
          <span>256-bit encrypted buyer session. No password required for demo access.</span>
        </div>
      </div>
    </div>
  );
};
