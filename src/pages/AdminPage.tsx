import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { Vehicle, VehicleCondition, Order, Post, Review, User, ChatMessage } from '../types';
import {
  Lock,
  Unlock,
  Car,
  ShoppingBag,
  FileText,
  Star,
  Database,
  Plus,
  Trash2,
  Edit,
  Download,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Search,
  Check,
  Copy,
  Printer,
  X,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Flame,
  Sparkles,
  Users,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  UserCheck,
  UserX,
  Send,
  RefreshCw,
  Phone,
  Mail,
} from 'lucide-react';
import { syncBatchToSupabase, SUPABASE_URL } from '../services/supabaseClient';
import { DirectImageUploader } from '../components/DirectImageUploader';

export const AdminPage: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicleSold,
    orders,
    updateOrderStatus,
    posts,
    addPost,
    updatePost,
    deletePost,
    reviews,
    addReview,
    deleteReview,
    resetAllData,
    formatPrice,
    supabaseHealth,
    isSupabaseLoading,
    refreshSupabaseStatus,

    // Users & Chat
    users,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    chatMessages,
    sendChatMessage,
    markChatRead,
  } = useStore();

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Retractable Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Active admin tab
  const [adminTab, setAdminTab] = useState<'overview' | 'vehicles' | 'orders' | 'users' | 'chat' | 'posts' | 'reviews' | 'database'>('vehicles');

  // Search & filter states
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [userSearch, setUserSearch] = useState('');

  // Live Chat tab state
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>(() => {
    return users.find(u => u.role !== 'admin')?.id || 'usr-1';
  });
  const [adminReplyInput, setAdminReplyInput] = useState('');

  // Vehicle editor modal state
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [vName, setVName] = useState('');
  const [vMake, setVMake] = useState('Porsche');
  const [vModel, setVModel] = useState('911 GT3 RS');
  const [vYear, setVYear] = useState(2026);
  const [vCondition, setVCondition] = useState<VehicleCondition>('Brand New');
  const [vPrice, setVPrice] = useState(245000);
  const [vSalePrice, setVSalePrice] = useState<string>('');
  const [vMileage, setVMileage] = useState('12 miles');
  const [vTransmission, setVTransmission] = useState('7-Speed Dual-Clutch PDK');
  const [vExteriorColor, setVExteriorColor] = useState('Arctic Grey');
  const [vInteriorColor, setVInteriorColor] = useState('Black Leather / Race-Tex');
  const [vFuelType, setVFuelType] = useState('Gasoline');
  const [vBodyType, setVBodyType] = useState('Coupe');
  const [vEngine, setVEngine] = useState('4.0L Naturally Aspirated Boxer-6 (518 HP)');
  const [vDrivetrain, setVDrivetrain] = useState('Rear-Wheel Drive');
  const [vVin, setVVin] = useState('WP0AB2A99TR928104');
  const [vTitleStatus, setVTitleStatus] = useState('MSO / Clean Title');
  const [vTrim, setVTrim] = useState('Weissach Package');
  const [vImages, setVImages] = useState<string[]>(['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80']);
  const [vDesc, setVDesc] = useState('Pristine vehicle with complete service history, clean title, and full warranty.');
  const [vIsHotDeal, setVIsHotDeal] = useState(false);
  const [vIsFeatured, setVIsFeatured] = useState(true);

  // User creation modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user');

  // Article editor state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState('Repo Advice');
  const [pExcerpt, setPExcerpt] = useState('');
  const [pContent, setPContent] = useState('');
  const [pCover, setPCover] = useState('');

  // Review modal state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rName, setRName] = useState('');
  const [rLocation, setRLocation] = useState('Texas');
  const [rRating, setRRating] = useState(5);
  const [rBody, setRBody] = useState('');
  const [rVehicle, setRVehicle] = useState('2024 BMW M5');

  // Supabase sync feedback
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message: string; success?: boolean } | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);

  // Authentication handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(username, password)) {
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Demo credentials: admin / admin123');
    }
  };

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(v => {
    const q = vehicleSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      v.name.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.vin.toLowerCase().includes(q) ||
      v.condition.toLowerCase().includes(q)
    );
  });

  // Filtered orders
  const filteredOrders = orders.filter(ord => {
    if (orderFilter === 'all') return true;
    return ord.status === orderFilter;
  });

  // Filtered users
  const filteredUsers = users.filter(u => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return true;
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.phone && u.phone.includes(q));
  });

  // Chat calculations
  const chatUsers = users.filter(u => u.role !== 'admin');
  const activeChatUser = users.find(u => u.id === selectedChatUserId) || chatUsers[0];
  const activeChatMessages = chatMessages.filter(m => m.userId === selectedChatUserId);
  const totalUnreadAdminMessages = chatMessages.filter(m => !m.read && m.sender === 'user').length;

  // Open Add Vehicle
  const openAddVehicle = () => {
    setEditingVehicleId(null);
    setVName('');
    setVMake('Porsche');
    setVModel('911 GT3 RS');
    setVYear(2026);
    setVCondition('Brand New');
    setVPrice(245000);
    setVSalePrice('');
    setVMileage('12 miles');
    setVTransmission('7-Speed Dual-Clutch PDK');
    setVExteriorColor('Arctic Grey');
    setVInteriorColor('Black Leather / Race-Tex');
    setVFuelType('Gasoline');
    setVBodyType('Coupe');
    setVEngine('4.0L Naturally Aspirated Boxer-6 (518 HP)');
    setVDrivetrain('Rear-Wheel Drive');
    setVVin('WP0AB2A' + Math.floor(1000000000 + Math.random() * 9000000000));
    setVTitleStatus('MSO / Clean Title');
    setVTrim('Weissach Package');
    setVImages(['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80']);
    setVDesc('Pristine vehicle with complete service history, clean title, and full factory hold guarantee.');
    setVIsHotDeal(false);
    setVIsFeatured(true);
    setIsVehicleModalOpen(true);
  };

  // Open Edit Vehicle
  const openEditVehicle = (v: Vehicle) => {
    setEditingVehicleId(v.id);
    setVName(v.name);
    setVMake(v.make);
    setVModel(v.model);
    setVYear(v.year);
    setVCondition(v.condition);
    setVPrice(v.price);
    setVSalePrice(v.sale_price ? String(v.sale_price) : '');
    setVMileage(v.mileage);
    setVTransmission(v.transmission);
    setVExteriorColor(v.exterior_color);
    setVInteriorColor(v.interior_color);
    setVFuelType(v.fuel_type);
    setVBodyType(v.body_type);
    setVEngine(v.engine || '');
    setVDrivetrain(v.drivetrain || '');
    setVVin(v.vin);
    setVTitleStatus(v.title_status);
    setVTrim(v.trim || '');
    setVImages(v.images && v.images.length > 0 ? v.images : []);
    setVDesc(v.description);
    setVIsHotDeal(v.is_hot_deal);
    setVIsFeatured(v.is_featured);
    setIsVehicleModalOpen(true);
  };

  // Save Vehicle
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    const imgList = vImages.length > 0 ? vImages : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'];

    const vehiclePayload = {
      slug: (vName || `${vYear}-${vMake}-${vModel}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: vName || `${vYear} ${vMake} ${vModel}`,
      condition: vCondition,
      make: vMake,
      model: vModel,
      year: vYear,
      price: vPrice,
      sale_price: vSalePrice ? Number(vSalePrice) : null,
      down_payment: Math.round(vPrice * 0.1),
      mileage: vMileage,
      transmission: vTransmission,
      exterior_color: vExteriorColor,
      interior_color: vInteriorColor,
      fuel_type: vFuelType,
      body_type: vBodyType,
      engine: vEngine,
      drivetrain: vDrivetrain,
      vin: vVin,
      title_status: vTitleStatus,
      trim: vTrim,
      description: vDesc,
      features: ['Factory Warranty', '150-Point Inspection', 'Clean Title', 'Full Records'],
      images: imgList,
      is_hot_deal: vIsHotDeal,
      is_sold: false,
      is_featured: vIsFeatured,
      sort_order: 0,
    };

    if (editingVehicleId) {
      await updateVehicle(editingVehicleId, vehiclePayload);
    } else {
      await addVehicle(vehiclePayload);
    }

    setIsVehicleModalOpen(false);
  };

  // Push local data to Supabase
  const handleSyncToSupabase = async () => {
    setSyncStatus({ loading: true, message: `Syncing ${vehicles.length} vehicles, ${posts.length} articles, and ${reviews.length} reviews to Supabase...` });
    const res = await syncBatchToSupabase(vehicles, posts, reviews);
    setSyncStatus({ loading: false, message: res.message, success: res.success });
    await refreshSupabaseStatus();
  };

  // Copy Fixed SQL Script
  const handleCopyFixedSQL = async () => {
    try {
      const resp = await fetch('/schema_and_seed.sql');
      const text = await resp.text();
      await navigator.clipboard.writeText(text);
      setCopiedSQL(true);
      setTimeout(() => setCopiedSQL(false), 3000);
    } catch {
      alert('Unable to load schema_and_seed.sql automatically. Please download it below.');
    }
  };

  const handleDownloadSQL = () => {
    const a = document.createElement('a');
    a.href = '/schema_and_seed.sql';
    a.download = 'schema_and_seed.sql';
    a.click();
  };

  const handleExportJSON = () => {
    const data = { vehicles, posts, reviews, orders, users, chatMessages };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chung_motors_complete_dataset.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAdminSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyInput.trim() || !selectedChatUserId) return;
    sendChatMessage(adminReplyInput.trim(), 'admin', selectedChatUserId);
    setAdminReplyInput('');
  };

  const handleCannedReply = (text: string) => {
    if (!selectedChatUserId) return;
    sendChatMessage(text, 'admin', selectedChatUserId);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      phone: newUserPhone.trim(),
      role: newUserRole,
      status: 'active',
    });
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setIsAddUserModalOpen(false);
  };

  interface NavTabItem {
    id: 'overview' | 'vehicles' | 'orders' | 'users' | 'chat' | 'posts' | 'reviews' | 'database';
    label: string;
    icon: any;
    count?: number | string;
    isBadge?: boolean;
  }

  // Navigation Items
  const navTabs: NavTabItem[] = [
    { id: 'overview', label: 'Overview KPIs', icon: TrendingUp },
    { id: 'vehicles', label: 'Vehicles Inventory', icon: Car, count: vehicles.length },
    { id: 'orders', label: 'Orders & Holds', icon: ShoppingBag, count: orders.length },
    { id: 'users', label: 'Manage Users', icon: Users, count: users.length },
    { id: 'chat', label: 'Live Chat', icon: MessageCircle, count: totalUnreadAdminMessages > 0 ? `${totalUnreadAdminMessages} new` : undefined, isBadge: totalUnreadAdminMessages > 0 },
    { id: 'posts', label: 'Buyer Guides', icon: FileText, count: posts.length },
    { id: 'reviews', label: 'Customer Reviews', icon: Star, count: reviews.length },
    { id: 'database', label: 'Database & Sync', icon: Database },
  ];

  // If not logged in, show secure login form
  if (!isAdmin) {
    return (
      <div style={{ background: '#f7f7f8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 16px' }}>
        <div className="admin-card-panel" style={{ width: '100%', maxWidth: '420px', padding: '28px 20px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#0a0a0a', color: '#ffffff', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={22} color="#3b82f6" fill="#3b82f6" />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Admin Control Center
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '4px' }}>
              Restricted management console for Chung Motors
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Username</label>
              <input
                type="text"
                required
                className="input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>Password</label>
              <input
                type="password"
                required
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem' }}>
                {loginError}
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ height: '44px', fontWeight: 700, fontSize: '0.95rem', marginTop: '6px' }}>
              Sign In to Admin Dashboard
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '8px' }}>
              Demo Credentials: <code>admin</code> / <code>admin123</code>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const renderSidebarNavLinks = (onSelect?: () => void) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '12px 10px' }}>
      {navTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = adminTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              setAdminTab(tab.id as any);
              if (tab.id === 'chat' && selectedChatUserId) {
                markChatRead(selectedChatUserId);
              }
              if (onSelect) onSelect();
            }}
            title={tab.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed && !onSelect ? 'center' : 'space-between',
              padding: isSidebarCollapsed && !onSelect ? '12px 0' : '10px 14px',
              borderRadius: '10px',
              border: 'none',
              background: isActive ? 'var(--accent-purple)' : 'transparent',
              color: isActive ? '#ffffff' : '#94a3b8',
              cursor: 'pointer',
              fontWeight: isActive ? 700 : 500,
              fontSize: '0.85rem',
              transition: 'all 0.15s ease',
              width: '100%',
              textAlign: 'left',
            }}
            onMouseEnter={e => {
              if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            }}
            onMouseLeave={e => {
              if (!isActive) e.currentTarget.style.background = 'transparent';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon size={18} color={isActive ? '#ffffff' : '#cbd5e1'} style={{ flexShrink: 0 }} />
              {(!isSidebarCollapsed || onSelect) && <span>{tab.label}</span>}
            </div>

            {(!isSidebarCollapsed || onSelect) && tab.count !== undefined && (
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: (tab as any).isBadge
                    ? '#ef4444'
                    : isActive
                    ? 'rgba(255,255,255,0.2)'
                    : 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div style={{ background: '#f7f7f8', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Mobile Top Header (< 960px) */}
      <div className="admin-mobile-topbar">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          <Menu size={18} />
          <span>Admin Menu</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={15} color="#2563eb" fill="#2563eb" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff' }}>
            {navTabs.find(t => t.id === adminTab)?.label}
          </span>
        </div>

        <button
          onClick={logoutAdmin}
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      <div
        className={`admin-sidebar-mobile-backdrop ${isMobileDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsMobileDrawerOpen(false)}
      />

      {/* Mobile Off-Canvas Drawer */}
      <aside className={`admin-sidebar-mobile-drawer ${isMobileDrawerOpen ? 'open' : ''}`}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={16} color="#2563eb" fill="#2563eb" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>Chung Motors</div>
              <div style={{ fontSize: '0.7rem', color: '#10b981' }}>● Admin Console</div>
            </div>
          </div>
          <button onClick={() => setIsMobileDrawerOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {renderSidebarNavLinks(() => setIsMobileDrawerOpen(false))}
        </div>

        <div style={{ padding: '14px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/"
            style={{
              color: '#94a3b8',
              textDecoration: 'none',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ExternalLink size={14} /> View Live Website
          </Link>
          <button
            onClick={logoutAdmin}
            style={{
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.1)',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Unlock size={14} /> Log Out Admin
          </button>
        </div>
      </aside>

      {/* Main Container Layout */}
      <div className="admin-layout-root">
        {/* Desktop Retractable Sidebar */}
        <aside
          className="admin-sidebar-desktop"
          style={{
            width: isSidebarCollapsed ? '76px' : '260px',
          }}
        >
          {/* Brand & Collapse Header */}
          <div
            style={{
              padding: '18px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
              alignItems: 'center',
            }}
          >
            {!isSidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Flame size={18} color="#2563eb" fill="#2563eb" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    Chung Motors
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600 }}>
                    Control Center
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Retract sidebar'}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                color: '#cbd5e1',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.16)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>

          {/* Navigation Links */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {renderSidebarNavLinks()}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: isSidebarCollapsed ? '12px 6px' : '14px 16px',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <Link
              to="/"
              title="View Public Site"
              style={{
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                gap: '8px',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <ExternalLink size={15} />
              {!isSidebarCollapsed && <span>View Live Site</span>}
            </Link>

            <button
              onClick={logoutAdmin}
              title="Log Out Admin"
              style={{
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.08)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
                gap: '8px',
              }}
            >
              <Unlock size={15} />
              {!isSidebarCollapsed && <span>Log Out</span>}
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main style={{ flex: 1, minWidth: 0, padding: '24px 20px 80px', overflowX: 'hidden' }}>
          {/* Top Bar on Desktop */}
          <div className="desk-only" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  ✓ Authenticated System Administrator
                </span>
                <h1 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 800, color: '#111827', margin: '4px 0 0', lineHeight: 1.2 }}>
                  {navTabs.find(t => t.id === adminTab)?.label}
                </h1>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={handleDownloadSQL}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Download SQL
                </button>
                <button
                  onClick={handleExportJSON}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <FileText size={14} /> Export Backup
                </button>
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW KPIS */}
          {adminTab === 'overview' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div className="admin-card-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Total Vehicle Inventory</span>
                    <Car size={18} color="var(--accent-purple)" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
                    {vehicles.length}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                    100% verified clean title listings
                  </span>
                </div>

                <div className="admin-card-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Reservations & Holds</span>
                    <ShoppingBag size={18} color="#059669" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
                    {orders.length}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {orders.filter(o => o.status === 'Deposit Paid' || o.status === 'Confirmed').length} active buyer holds
                  </span>
                </div>

                <div className="admin-card-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Registered Users</span>
                    <Users size={18} color="#2563eb" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
                    {users.length}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 700 }}>
                    {users.filter(u => u.status === 'active').length} active buyer accounts
                  </span>
                </div>

                <div className="admin-card-panel" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>Live Chat Inquiries</span>
                    <MessageCircle size={18} color="#d97706" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#111827' }}>
                    {chatMessages.length}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: totalUnreadAdminMessages > 0 ? '#ef4444' : '#059669', fontWeight: 700 }}>
                    {totalUnreadAdminMessages > 0 ? `${totalUnreadAdminMessages} unread messages` : 'All inquiries up to date'}
                  </span>
                </div>
              </div>

              {/* Database status card */}
              <div className="admin-card-panel" style={{ padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ flex: '1 1 280px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                      Supabase PostgreSQL Instance
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px', wordBreak: 'break-all' }}>
                      URL: <code>{SUPABASE_URL}</code>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      background: supabaseHealth?.connected ? '#d1fae5' : '#fee2e2',
                      color: supabaseHealth?.connected ? '#059669' : '#b91c1c',
                    }}>
                      {supabaseHealth?.connected ? '✓ Supabase Online' : '● Supabase Standby'}
                    </span>
                    <button onClick={() => setAdminTab('database')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                      Manage Database & SQL
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VEHICLES CRUD (RESPONSIVE) */}
          {adminTab === 'vehicles' && (
            <div className="admin-card-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                  <input
                    type="text"
                    className="input"
                    placeholder="Search by vehicle name, VIN, make..."
                    value={vehicleSearch}
                    onChange={e => setVehicleSearch(e.target.value)}
                    style={{ paddingLeft: '38px', height: '40px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={openAddVehicle} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.88rem' }}>
                    <Plus size={16} /> Add New Vehicle
                  </button>
                </div>
              </div>

              {/* Desktop / Tablet Table View (With Responsive Scroll) */}
              <div className="admin-table-desktop admin-table-scroll-wrapper">
                <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 10px' }}>Vehicle</th>
                      <th style={{ padding: '12px 10px' }}>Condition</th>
                      <th style={{ padding: '12px 10px' }}>Price</th>
                      <th style={{ padding: '12px 10px' }}>Mileage</th>
                      <th style={{ padding: '12px 10px' }}>VIN</th>
                      <th style={{ padding: '12px 10px' }}>Status</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map(veh => (
                      <tr key={veh.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={veh.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=120&q=80'}
                              alt={veh.name}
                              style={{ width: '52px', height: '38px', borderRadius: '6px', objectFit: 'cover', background: '#f3f4f6' }}
                            />
                            <div>
                              <strong style={{ color: '#111827', display: 'block' }}>{veh.name}</strong>
                              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{veh.year} • {veh.trim || veh.model}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: veh.condition === 'Brand New' ? '#ede9fe' : veh.condition === 'Bank Seized / Repo' ? '#ffe4e6' : '#ecfdf5',
                            color: veh.condition === 'Brand New' ? 'var(--accent-purple)' : veh.condition === 'Bank Seized / Repo' ? '#e11d48' : '#059669',
                          }}>
                            {veh.condition}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px', fontWeight: 800, color: '#111827' }}>
                          {formatPrice(veh.price)}
                        </td>
                        <td style={{ padding: '12px 10px', color: '#4b5563' }}>
                          {veh.mileage}
                        </td>
                        <td style={{ padding: '12px 10px', color: '#6b7280', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                          {veh.vin}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <button
                            onClick={() => toggleVehicleSold(veh.id)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              border: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: veh.is_sold ? '#fee2e2' : '#d1fae5',
                              color: veh.is_sold ? '#b91c1c' : '#059669',
                            }}
                          >
                            {veh.is_sold ? 'Sold' : 'Available'}
                          </button>
                        </td>
                        <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => openEditVehicle(veh)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                              title="Edit specs"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${veh.name} permanently?`)) {
                                  deleteVehicle(veh.id);
                                }
                              }}
                              className="btn btn-danger"
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                              title="Delete vehicle"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View (< 768px) */}
              <div className="admin-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
                {filteredVehicles.map(veh => (
                  <div key={veh.id} style={{ border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '14px', background: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <img
                        src={veh.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=160&q=80'}
                        alt={veh.name}
                        style={{ width: '70px', height: '52px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, background: '#e5e7eb' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ fontSize: '0.9rem', color: '#111827', lineHeight: 1.25, display: 'block', wordBreak: 'break-word' }}>
                          {veh.name}
                        </strong>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                          {veh.year} • {veh.trim || veh.model} • {veh.mileage}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '6px' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#111827' }}>{formatPrice(veh.price)}</span>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '9999px',
                            background: veh.condition === 'Brand New' ? '#ede9fe' : veh.condition === 'Bank Seized / Repo' ? '#ffe4e6' : '#ecfdf5',
                            color: veh.condition === 'Brand New' ? 'var(--accent-purple)' : veh.condition === 'Bank Seized / Repo' ? '#e11d48' : '#059669',
                          }}>
                            {veh.condition}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        onClick={() => toggleVehicleSold(veh.id)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          border: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          background: veh.is_sold ? '#fee2e2' : '#d1fae5',
                          color: veh.is_sold ? '#b91c1c' : '#059669',
                        }}
                      >
                        {veh.is_sold ? 'Sold' : 'Available'}
                      </button>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => openEditVehicle(veh)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete ${veh.name} permanently?`)) {
                              deleteVehicle(veh.id);
                            }
                          }}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {adminTab === 'orders' && (
            <div className="admin-card-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Reservations & Orders ({orders.length})
                </h2>

                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', maxWidth: '100%', paddingBottom: '4px' }}>
                  {['all', 'Pending', 'Deposit Paid', 'Confirmed', 'Delivered', 'Cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        border: orderFilter === st ? '1px solid var(--accent-purple)' : '1px solid #e5e7eb',
                        background: orderFilter === st ? '#ede9fe' : '#ffffff',
                        color: orderFilter === st ? 'var(--accent-purple)' : '#4b5563',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {filteredOrders.map(ord => (
                    <div
                      key={ord.id}
                      className="admin-order-item"
                      style={{
                        border: '1px solid #e5e7eb',
                        borderRadius: 'var(--radius-lg)',
                        padding: '16px 18px',
                        background: '#ffffff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '14px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>#{ord.order_number}</span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: '#ede9fe', color: 'var(--accent-purple)' }}>
                            {ord.status}
                          </span>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: '#ecfdf5', color: '#059669' }}>
                            {ord.paymentMethod || 'Peer Pay'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', marginTop: '4px' }}>
                          Vehicle: {ord.vehicle?.name} ({formatPrice(ord.amount || 500)})
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px', wordBreak: 'break-word' }}>
                          Customer: {ord.customer?.fullName} • {ord.customer?.phone} • {ord.customer?.email}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>
                          Delivery: {ord.deliveryOption} • {ord.customer?.city}, {ord.customer?.state} {ord.customer?.zipCode}
                        </div>
                      </div>

                      <div className="admin-order-controls" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <select
                          className="select"
                          value={ord.status}
                          onChange={e => updateOrderStatus(ord.id, e.target.value as any)}
                          style={{ height: '36px', fontSize: '0.8rem', minWidth: '130px' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Deposit Paid">Deposit Paid</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => window.print()}
                          className="btn btn-secondary"
                          style={{ padding: '8px 12px', fontSize: '0.8rem', height: '36px' }}
                          title="Print bill of sale"
                        >
                          <Printer size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '0.85rem' }}>
                  No reservations or orders match the selected filter.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: USER MANAGEMENT (NEW) */}
          {adminTab === 'users' && (
            <div className="admin-card-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#9ca3af' }} />
                  <input
                    type="text"
                    className="input"
                    placeholder="Search users by name, email, phone..."
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    style={{ paddingLeft: '38px', height: '40px', fontSize: '0.85rem' }}
                  />
                </div>

                <button
                  onClick={() => setIsAddUserModalOpen(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.88rem' }}
                >
                  <Plus size={16} /> Add New User
                </button>
              </div>

              {/* Desktop Table View */}
              <div className="admin-table-desktop admin-table-scroll-wrapper">
                <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 10px' }}>User Details</th>
                      <th style={{ padding: '12px 10px' }}>Phone</th>
                      <th style={{ padding: '12px 10px' }}>Role</th>
                      <th style={{ padding: '12px 10px' }}>Status</th>
                      <th style={{ padding: '12px 10px' }}>Registered</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ fontWeight: 700, color: '#111827' }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '12px 10px', color: '#4b5563', fontSize: '0.82rem' }}>
                          {u.phone || '—'}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: u.role === 'admin' ? '#ede9fe' : '#e0f2fe',
                            color: u.role === 'admin' ? 'var(--accent-purple)' : '#0284c7',
                          }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            background: u.status === 'active' ? '#d1fae5' : '#fee2e2',
                            color: u.status === 'active' ? '#059669' : '#b91c1c',
                          }}>
                            {u.status === 'active' ? '● Active' : '● Suspended'}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px', fontSize: '0.75rem', color: '#9ca3af' }}>
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              onClick={() => {
                                setSelectedChatUserId(u.id);
                                setAdminTab('chat');
                              }}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                              title="Open live chat"
                            >
                              <MessageCircle size={13} color="#2563eb" /> Chat
                            </button>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                              title={u.status === 'active' ? 'Suspend user' : 'Activate user'}
                            >
                              {u.status === 'active' ? <UserX size={13} color="#f59e0b" /> : <UserCheck size={13} color="#10b981" />}
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete user ${u.name} permanently?`)) {
                                  deleteUser(u.id);
                                }
                              }}
                              className="btn btn-danger"
                              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                              title="Delete user"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View for Users (< 768px) */}
              <div className="admin-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: '12px' }}>
                {filteredUsers.map(u => (
                  <div key={u.id} style={{ border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '14px', background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>{u.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>{u.email}</div>
                        {u.phone && <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{u.phone}</div>}
                      </div>
                      <span style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: u.status === 'active' ? '#d1fae5' : '#fee2e2',
                        color: u.status === 'active' ? '#059669' : '#b91c1c',
                      }}>
                        {u.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Role: {u.role}</span>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setSelectedChatUserId(u.id);
                            setAdminTab('chat');
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <MessageCircle size={13} color="#2563eb" /> Chat
                        </button>
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        >
                          {u.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete user ${u.name}?`)) deleteUser(u.id);
                          }}
                          className="btn btn-danger"
                          style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: LIVE CHAT & INQUIRIES (NEW) */}
          {adminTab === 'chat' && (
            <div className="admin-card-panel" style={{ padding: 0, overflow: 'hidden', display: 'flex', height: '640px', border: '1px solid #e5e7eb' }}>
              {/* Left Column: Chat Users Thread List */}
              <div
                style={{
                  width: '320px',
                  maxWidth: '40%',
                  borderRight: '1px solid #e5e7eb',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb', background: '#ffffff' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111827' }}>
                    Customer Conversations
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {chatUsers.length} registered customers
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                  {chatUsers.map(u => {
                    const uMsgs = chatMessages.filter(m => m.userId === u.id);
                    const lastMsg = uMsgs[uMsgs.length - 1];
                    const isSelected = selectedChatUserId === u.id;
                    const uUnread = uMsgs.filter(m => !m.read && m.sender === 'user').length;

                    return (
                      <div
                        key={u.id}
                        onClick={() => {
                          setSelectedChatUserId(u.id);
                          markChatRead(u.id);
                        }}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f1f5f9',
                          background: isSelected ? '#ede9fe' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'background 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ fontSize: '0.88rem', color: '#111827' }}>{u.name}</strong>
                          {uUnread > 0 && (
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, background: '#ef4444', color: '#fff', padding: '1px 6px', borderRadius: '9999px' }}>
                              {uUnread} new
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#4b5563', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lastMsg ? lastMsg.message : 'No messages yet'}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '4px' }}>
                          {u.email}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Conversation Pane */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
                {activeChatUser ? (
                  <>
                    {/* Header */}
                    <div style={{ padding: '14px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#111827' }}>
                          {activeChatUser.name}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                          {activeChatUser.email} {activeChatUser.phone && `• ${activeChatUser.phone}`}
                        </div>
                      </div>

                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px', background: '#d1fae5', color: '#059669' }}>
                        ● Active Buyer Session
                      </span>
                    </div>

                    {/* Messages History */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', background: '#f9fafb', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeChatMessages.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', margin: '40px 0' }}>
                          No messages in this customer thread yet. Use the reply box below to send an opening greeting.
                        </div>
                      )}

                      {activeChatMessages.map(msg => {
                        const isAdminMsg = msg.sender === 'admin';
                        return (
                          <div
                            key={msg.id}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: isAdminMsg ? 'flex-end' : 'flex-start',
                            }}
                          >
                            <div
                              style={{
                                maxWidth: '78%',
                                padding: '10px 16px',
                                borderRadius: isAdminMsg ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                                background: isAdminMsg ? 'var(--accent-purple)' : '#ffffff',
                                color: isAdminMsg ? '#ffffff' : '#111827',
                                fontSize: '0.88rem',
                                lineHeight: 1.45,
                                border: isAdminMsg ? 'none' : '1px solid #e5e7eb',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.04)',
                                wordBreak: 'break-word',
                              }}
                            >
                              <div style={{ fontSize: '0.7rem', fontWeight: 800, marginBottom: '4px', opacity: 0.85 }}>
                                {isAdminMsg ? 'Chung Motors Staff (You)' : msg.userName}
                              </div>
                              {msg.message}
                            </div>
                            <span style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: '2px', padding: '0 4px' }}>
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Canned Quick Responses */}
                    <div style={{ padding: '8px 16px', background: '#f8fafc', borderTop: '1px solid #e5e7eb', overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => handleCannedReply('Yes, this vehicle is currently available in our VIP showroom.')}
                        style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '9999px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        + Vehicle Available
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCannedReply('Nationwide enclosed carrier transport takes 3 to 5 business days.')}
                        style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '9999px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        + Enclosed Transport Info
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCannedReply('We accept Zelle, Cash App, PayPal, Apple Pay, Chime, and Crypto (USDC/BTC).')}
                        style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '9999px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        + Payment Methods
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCannedReply('Our $500 reservation hold is 100% refundable for 72 hours.')}
                        style={{ padding: '4px 10px', fontSize: '0.72rem', borderRadius: '9999px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 600 }}
                      >
                        + 72-Hour Hold
                      </button>
                    </div>

                    {/* Admin Reply Input */}
                    <form onSubmit={handleAdminSendReply} style={{ padding: '14px 16px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '10px', background: '#ffffff' }}>
                      <input
                        type="text"
                        className="input"
                        placeholder={`Reply to ${activeChatUser.name}...`}
                        value={adminReplyInput}
                        onChange={e => setAdminReplyInput(e.target.value)}
                        style={{ flex: 1, height: '42px', fontSize: '0.88rem' }}
                      />
                      <button
                        type="submit"
                        disabled={!adminReplyInput.trim()}
                        className="btn btn-primary"
                        style={{ padding: '0 20px', height: '42px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Send size={15} /> Send Reply
                      </button>
                    </form>
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                    Select a customer thread from the left to view and answer live inquiries.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: POSTS */}
          {adminTab === 'posts' && (
            <div className="admin-card-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Buyer Guides & Articles ({posts.length})
                </h2>

                <button
                  onClick={() => {
                    setEditingPostId(null);
                    setPTitle('');
                    setPCategory('Buyer Guides');
                    setPExcerpt('');
                    setPContent('');
                    setPCover('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');
                    setIsPostModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.875rem' }}
                >
                  <Plus size={16} /> Create New Guide
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {posts.map(post => (
                  <div
                    key={post.id}
                    style={{
                      padding: '16px 18px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid #e5e7eb',
                      background: '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
                        {post.category}
                      </span>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: '2px 0 4px' }}>
                        {post.title}
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
                        {post.excerpt}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setEditingPostId(post.id);
                          setPTitle(post.title);
                          setPCategory(post.category);
                          setPExcerpt(post.excerpt);
                          setPContent(post.content);
                          setPCover(post.cover_image || '');
                          setIsPostModalOpen(true);
                        }}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete guide "${post.title}"?`)) {
                            deletePost(post.id);
                          }
                        }}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS */}
          {adminTab === 'reviews' && (
            <div className="admin-card-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Customer Reviews ({reviews.length})
                </h2>

                <button
                  onClick={() => {
                    setRName('');
                    setRLocation('Texas');
                    setRRating(5);
                    setRBody('');
                    setRVehicle('2024 BMW M5');
                    setIsReviewModalOpen(true);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.875rem' }}
                >
                  <Plus size={16} /> Add Review
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reviews.map(rev => (
                  <div
                    key={rev.id}
                    style={{
                      padding: '16px 18px',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid #e5e7eb',
                      background: '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <strong style={{ color: '#111827', fontSize: '0.9rem' }}>{rev.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>({rev.location})</span>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                            <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.84rem', color: '#374151', margin: '6px 0 0', lineHeight: 1.5, wordBreak: 'break-word' }}>
                        "{rev.body}"
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete review from ${rev.name}?`)) {
                          deleteReview(rev.id);
                        }
                      }}
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: DATABASE & SUPABASE MIGRATION HUB */}
          {adminTab === 'database' && (
            <div className="admin-card-panel" style={{ padding: '28px' }}>
              <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 28px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#ede9fe', color: 'var(--accent-purple)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={26} />
                </div>
                <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 1.85rem)', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Supabase & PostgreSQL Migration Hub
                </h2>
                <p style={{ color: '#4b5563', fontSize: '0.85rem', marginTop: '6px', lineHeight: 1.5, wordBreak: 'break-all' }}>
                  Connected instance: <code>{SUPABASE_URL}</code>
                </p>
              </div>

              {/* Live Status and Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Live Connection Status</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: supabaseHealth?.connected ? '#059669' : '#b91c1c' }}>
                    {supabaseHealth?.connected ? '✓ Online & Ready' : '● Schema Setup Pending'}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 12px' }}>
                    {supabaseHealth?.message || 'Run the migration query in your Supabase SQL editor.'}
                  </p>
                  <button onClick={refreshSupabaseStatus} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}>
                    {isSupabaseLoading ? 'Checking...' : 'Refresh Connection'}
                  </button>
                </div>

                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>1-Click Database Setup</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                    Fixed SQL Migration
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 12px' }}>
                    Copy the full SQL query to run in Supabase SQL Editor.
                  </p>
                  <button onClick={handleCopyFixedSQL} className="btn btn-primary" style={{ width: '100%', fontSize: '0.8rem', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    {copiedSQL ? <Check size={14} /> : <Copy size={14} />} {copiedSQL ? 'Copied to Clipboard!' : 'Copy Fixed SQL Script'}
                  </button>
                </div>

                <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b7280', marginBottom: '6px' }}>Batch Data Sync</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>
                    Sync Local to Supabase
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '4px 0 12px' }}>
                    Push {vehicles.length} vehicles, {posts.length} articles, and {reviews.length} reviews to Supabase.
                  </p>
                  <button onClick={handleSyncToSupabase} className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}>
                    Push Local Data to Supabase
                  </button>
                </div>
              </div>

              {syncStatus && (
                <div style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  background: syncStatus.success ? '#d1fae5' : '#fee2e2',
                  color: syncStatus.success ? '#065f46' : '#991b1b',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  textAlign: 'center',
                }}>
                  {syncStatus.message}
                </div>
              )}

              {/* Danger Zone */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button onClick={handleDownloadSQL} className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 12px' }}>
                    <Download size={14} /> Download SQL
                  </button>
                  <button onClick={handleExportJSON} className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 12px' }}>
                    <FileText size={14} /> Export Backup
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm('Reset all vehicle data, posts, reviews, orders, users, and chat messages back to initial defaults?')) {
                      resetAllData();
                      alert(`System data reset to initial defaults.`);
                    }
                  }}
                  className="btn btn-danger"
                  style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                >
                  <RotateCcw size={14} /> Reset Local State
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Add/Edit Vehicle */}
      {isVehicleModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsVehicleModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '680px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {editingVehicleId ? 'Edit Vehicle Specs' : 'Add New Vehicle to Inventory'}
              </h3>
              <button onClick={() => setIsVehicleModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Vehicle Name *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={vName}
                  onChange={e => setVName(e.target.value)}
                />
              </div>

              <div className="admin-form-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Make *</label>
                  <input type="text" required className="input" value={vMake} onChange={e => setVMake(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Model *</label>
                  <input type="text" required className="input" value={vModel} onChange={e => setVModel(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Year *</label>
                  <input type="number" required className="input" value={vYear} onChange={e => setVYear(Number(e.target.value))} />
                </div>
              </div>

              <div className="admin-form-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Condition *</label>
                  <select className="select" value={vCondition} onChange={e => setVCondition(e.target.value as any)}>
                    <option value="Brand New">Brand New</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    <option value="Used">Used</option>
                    <option value="Bank Seized / Repo">Bank Seized / Repo</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Price ($ USD) *</label>
                  <input type="number" required className="input" value={vPrice} onChange={e => setVPrice(Number(e.target.value))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Mileage</label>
                  <input type="text" className="input" value={vMileage} onChange={e => setVMileage(e.target.value)} />
                </div>
              </div>

              <div className="admin-form-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Transmission</label>
                  <input type="text" className="input" value={vTransmission} onChange={e => setVTransmission(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>VIN Number</label>
                  <input type="text" className="input" value={vVin} onChange={e => setVVin(e.target.value)} />
                </div>
              </div>

              <DirectImageUploader
                images={vImages}
                onChange={setVImages}
                maxImages={30}
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Description</label>
                <textarea
                  rows={3}
                  className="input"
                  value={vDesc}
                  onChange={e => setVDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
                  <input type="checkbox" checked={vIsFeatured} onChange={e => setVIsFeatured(e.target.checked)} />
                  Featured on Homepage
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', color: '#e11d48' }}>
                  <input type="checkbox" checked={vIsHotDeal} onChange={e => setVIsHotDeal(e.target.checked)} />
                  🔥 Mark as Hot Deal / Repo
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setIsVehicleModalOpen(false)} className="btn btn-secondary" style={{ flex: '1 1 100px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: '1 1 140px' }}>
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add User */}
      {isAddUserModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddUserModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px', width: '92%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                Register New User Account
              </h3>
              <button onClick={() => setIsAddUserModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Full Name *</label>
                <input type="text" required className="input" value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Jane Doe" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Email Address *</label>
                <input type="email" required className="input" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="jane@example.com" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Phone Number</label>
                <input type="tel" className="input" value={newUserPhone} onChange={e => setNewUserPhone(e.target.value)} placeholder="(555) 000-0000" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Role</label>
                <select className="select" value={newUserRole} onChange={e => setNewUserRole(e.target.value as any)}>
                  <option value="user">Customer (User)</option>
                  <option value="admin">Dealership Staff (Admin)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddUserModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Post */}
      {isPostModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsPostModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '640px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {editingPostId ? 'Edit Buyer Guide' : 'Create New Guide'}
              </h3>
              <button onClick={() => setIsPostModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              const payload = {
                title: pTitle,
                slug: pTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                category: pCategory,
                excerpt: pExcerpt,
                content: pContent,
                cover_image: pCover,
                keywords: ['cars', pCategory.toLowerCase()],
                author: 'Chung Motors Editorial',
                read_minutes: 5,
                is_published: true,
              };
              if (editingPostId) {
                updatePost(editingPostId, payload);
              } else {
                addPost(payload);
              }
              setIsPostModalOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Title *</label>
                <input type="text" required className="input" value={pTitle} onChange={e => setPTitle(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Category *</label>
                <input type="text" required className="input" value={pCategory} onChange={e => setPCategory(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Cover Image URL</label>
                <input type="text" className="input" value={pCover} onChange={e => setPCover(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Excerpt *</label>
                <textarea rows={2} required className="input" value={pExcerpt} onChange={e => setPExcerpt(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Full Content *</label>
                <textarea rows={6} required className="input" value={pContent} onChange={e => setPContent(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setIsPostModalOpen(false)} className="btn btn-secondary" style={{ flex: '1 1 100px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: '1 1 140px' }}>
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Review */}
      {isReviewModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsReviewModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px', width: '95%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                Add Verified Buyer Review
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              await addReview({
                name: rName,
                location: rLocation,
                rating: rRating,
                body: rBody,
                vehicle_bought: rVehicle,
              });
              setIsReviewModalOpen(false);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Customer Name *</label>
                <input type="text" required className="input" value={rName} onChange={e => setRName(e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Location</label>
                  <input type="text" className="input" value={rLocation} onChange={e => setRLocation(e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Vehicle</label>
                  <input type="text" className="input" value={rVehicle} onChange={e => setRVehicle(e.target.value)} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Rating (1-5)</label>
                <select className="select" value={rRating} onChange={e => setRRating(Number(e.target.value))}>
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Review Body *</label>
                <textarea rows={3} required className="input" value={rBody} onChange={e => setRBody(e.target.value)} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setIsReviewModalOpen(false)} className="btn btn-secondary" style={{ flex: '1 1 100px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: '1 1 140px' }}>
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
