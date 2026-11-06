import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MessageCircle,
  X,
  Send,
  User,
  ShieldCheck,
  Flame,
  Minus,
  Sparkles,
  LogOut,
  ChevronDown,
} from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const {
    currentUser,
    openLoginModal,
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendChatMessage,
    markChatRead,
    logoutUser,
  } = useStore();

  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for current user
  const userMessages = currentUser
    ? chatMessages.filter(m => m.userId === currentUser.id)
    : [];

  const unreadCount = userMessages.filter(m => !m.read && m.sender === 'admin').length;

  useEffect(() => {
    if (isChatOpen && currentUser) {
      markChatRead(currentUser.id);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isChatOpen, userMessages.length, currentUser]);

  const handleOpenClick = () => {
    if (!currentUser) {
      openLoginModal();
    } else {
      setIsChatOpen(!isChatOpen);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    if (!currentUser) {
      openLoginModal();
      return;
    }
    sendChatMessage(inputMsg.trim(), 'user', currentUser.id);
    setInputMsg('');
  };

  const handleQuickPrompt = (prompt: string) => {
    if (!currentUser) {
      openLoginModal();
      return;
    }
    sendChatMessage(prompt, 'user', currentUser.id);
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 998,
        }}
      >
        {!isChatOpen && (
          <button
            onClick={handleOpenClick}
            aria-label="Open Live Concierge Chat"
            style={{
              background: '#0a0a0a',
              color: '#ffffff',
              border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: '9999px',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(0,0,0,0.25)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Flame size={18} color="#2563eb" fill="#2563eb" />
              <div
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#10b981',
                  border: '2px solid #000',
                }}
              />
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, lineHeight: 1.2 }}>
                Live Concierge
              </div>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                {currentUser ? `Hi, ${currentUser.name.split(' ')[0]}` : 'Sign in to chat'}
              </div>
            </div>

            {unreadCount > 0 && (
              <span
                style={{
                  background: '#e11d48',
                  color: '#fff',
                  borderRadius: '9999px',
                  padding: '2px 7px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  marginLeft: '2px',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Floating Chat Window */}
      {isChatOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            height: '560px',
            maxHeight: 'calc(100vh - 80px)',
            background: '#ffffff',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.22), 0 1px 3px rgba(0,0,0,0.1)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #e5e7eb',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#0a0a0a',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <Flame size={20} color="#2563eb" fill="#2563eb" />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#10b981',
                    border: '2px solid #0a0a0a',
                  }}
                />
              </div>

              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Chung Motors Live Concierge
                </div>
                <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>●</span> <span>Senior Advisor Online</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsChatOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* User Session Bar */}
          <div
            style={{
              background: '#f8fafc',
              borderBottom: '1px solid #e2e8f0',
              padding: '8px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
              <User size={14} color="#64748b" />
              <span style={{ fontWeight: 700, color: '#0f172a' }}>{currentUser?.name}</span>
              <span style={{ color: '#94a3b8' }}>• {currentUser?.email}</span>
            </div>

            <button
              onClick={logoutUser}
              title="Sign out of customer session"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              background: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {/* Security Welcome Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 14px',
                textAlign: 'center',
                fontSize: '0.78rem',
                color: '#6b7280',
              }}
            >
              <ShieldCheck size={20} color="#059669" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontWeight: 700, color: '#111827' }}>Verified Dealership Concierge</div>
              <div>Direct channel to senior automotive specialists. Inquire on 2026 factory allocations, wholesale repos, or enclosed carrier delivery.</div>
            </div>

            {userMessages.length === 0 && (
              <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.82rem', margin: '20px 0' }}>
                Start a conversation with our concierge below!
              </div>
            )}

            {userMessages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '82%',
                      padding: '10px 14px',
                      borderRadius: isUser ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                      background: isUser ? '#2563eb' : '#ffffff',
                      color: isUser ? '#ffffff' : '#111827',
                      fontSize: '0.88rem',
                      lineHeight: 1.45,
                      boxShadow: isUser ? '0 2px 6px rgba(37,99,235,0.2)' : '0 2px 6px rgba(0,0,0,0.05)',
                      border: isUser ? 'none' : '1px solid #e5e7eb',
                      wordBreak: 'break-word',
                    }}
                  >
                    {!isUser && (
                      <div
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          color: '#2563eb',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Flame size={12} fill="#2563eb" /> Dealership Concierge
                      </div>
                    )}
                    {msg.message}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '3px', padding: '0 4px' }}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Suggestions */}
          <div
            style={{
              padding: '6px 12px',
              background: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              display: 'flex',
              gap: '6px',
            }}
          >
            <button
              onClick={() => handleQuickPrompt('How does the $500 reservation hold work?')}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              $500 Hold Process?
            </button>
            <button
              onClick={() => handleQuickPrompt('What payment methods are supported?')}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Payment Methods?
            </button>
            <button
              onClick={() => handleQuickPrompt('Can you provide an enclosed shipping timeline?')}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '0.72rem',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Shipping Timeline?
            </button>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '12px 14px',
              background: '#ffffff',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              className="input"
              placeholder="Ask our dealership concierge..."
              value={inputMsg}
              onChange={e => setInputMsg(e.target.value)}
              style={{
                flex: 1,
                height: '42px',
                fontSize: '0.85rem',
                padding: '8px 14px',
                borderRadius: '9999px',
              }}
            />
            <button
              type="submit"
              disabled={!inputMsg.trim()}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: inputMsg.trim() ? '#2563eb' : '#e2e8f0',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputMsg.trim() ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                transition: 'background 0.15s ease',
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
