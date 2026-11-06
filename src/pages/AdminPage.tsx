import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import type { Vehicle, VehicleCondition, Order, Post, Review } from '../types';
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
  } = useStore();

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active admin tab
  const [adminTab, setAdminTab] = useState<'overview' | 'vehicles' | 'orders' | 'posts' | 'reviews' | 'database'>('overview');

  // Search & filter
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<string>('all');

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

  // Article editor state
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [pTitle, setPTitle] = useState('');
  const [pCategory, setPCategory] = useState('Buyer Guides');
  const [pExcerpt, setPExcerpt] = useState('');
  const [pContent, setPContent] = useState('');
  const [pCover, setPCover] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80');

  // Review editor state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rName, setRName] = useState('');
  const [rLocation, setRLocation] = useState('California');
  const [rRating, setRRating] = useState(5);
  const [rBody, setRBody] = useState('');
  const [rVehicle, setRVehicle] = useState('2026 Porsche 911 GT3 RS');

  // Supabase sync feedback
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message: string; success?: boolean } | null>(null);
  const [copiedSQL, setCopiedSQL] = useState(false);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(username, password);
    if (!ok) {
      setLoginError('Invalid credentials. Use admin / admin123');
    } else {
      setLoginError('');
    }
  };

  // KPI Calculations
  const totalValuation = vehicles.reduce((sum, v) => sum + (v.price || 0), 0);
  const soldUnits = vehicles.filter(v => v.is_sold).length;
  const activeUnits = vehicles.length - soldUnits;
  const totalDeposits = orders.reduce((sum, o) => sum + (o.amount || 500), 0);

  // Filtered vehicles
  const filteredVehicles = vehicles.filter(v => {
    if (!vehicleSearch) return true;
    const q = vehicleSearch.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.make.toLowerCase().includes(q) ||
      v.model.toLowerCase().includes(q) ||
      v.vin.toLowerCase().includes(q) ||
      v.condition.toLowerCase().includes(q)
    );
  });

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

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
    setVTransmission('PDK Dual-Clutch');
    setVExteriorColor('Arctic Grey');
    setVInteriorColor('Black Alcantara');
    setVFuelType('Gasoline');
    setVBodyType('Coupe');
    setVEngine('4.0L Naturally Aspirated (518 HP)');
    setVDrivetrain('Rear-Wheel Drive');
    setVVin('WP0AB' + Math.floor(10000000 + Math.random() * 90000000));
    setVTitleStatus('MSO / Clean Title');
    setVTrim('Weissach Package');
    setVImages(['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80']);
    setVDesc('Unregistered factory fresh unit with complete manufacturer warranty.');
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
      images: imgList.length > 0 ? imgList : ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80'],
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
    const data = { vehicles, posts, reviews, orders };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usedcars_complete_dataset.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // If not logged in, show secure login form
  if (!isAdmin) {
    return (
      <div style={{ background: '#f7f7f8', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px 16px' }}>
        <div className="admin-card-panel" style={{ width: '100%', maxWidth: '420px', padding: '28px 20px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '22px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-purple)', color: '#ffffff', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              Admin Portal Login
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
              />
            </div>

            {loginError && (
              <div style={{ color: '#e11d48', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
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

  return (
    <div style={{ background: '#f7f7f8', minHeight: '90vh', padding: '20px 0 80px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        {/* Top Bar */}
        <div className="admin-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                Authenticated Administrator
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 800, color: '#111827', margin: '4px 0 0', lineHeight: 1.2 }}>
              Dealership Control Center
            </h1>
          </div>

          <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={handleDownloadSQL}
              className="btn btn-secondary"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
            >
              <Download size={14} /> Download SQL
            </button>
            <button
              onClick={logoutAdmin}
              className="btn btn-danger"
              style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
            >
              <Unlock size={14} /> Log Out
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-tabs-nav" style={{ display: 'flex', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-lg)', padding: '6px', gap: '6px', marginBottom: '24px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          <button
            onClick={() => setAdminTab('overview')}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: adminTab === 'overview' ? 'var(--accent-purple)' : 'transparent',
              color: adminTab === 'overview' ? '#ffffff' : '#4b5563',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <TrendingUp size={15} /> Overview KPIs
          </button>

          <button
            onClick={() => setAdminTab('vehicles')}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: adminTab === 'vehicles' ? 'var(--accent-purple)' : 'transparent',
              color: adminTab === 'vehicles' ? '#ffffff' : '#4b5563',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Car size={15} /> Vehicles ({vehicles.length})
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: adminTab === 'orders' ? 'var(--accent-purple)' : 'transparent',
              color: adminTab === 'orders' ? '#ffffff' : '#4b5563',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <ShoppingBag size={15} /> Orders & Holds ({orders.length})
          </button>

          <button
            onClick={() => setAdminTab('posts')}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: adminTab === 'posts' ? 'var(--accent-purple)' : 'transparent',
              color: adminTab === 'posts' ? '#ffffff' : '#4b5563',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <FileText size={15} /> Buyer Guides ({posts.length})
          </button>

          <button
            onClick={() => setAdminTab('reviews')}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: adminTab === 'reviews' ? 'var(--accent-purple)' : 'transparent',
              color: adminTab === 'reviews' ? '#ffffff' : '#4b5563',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Star size={15} /> Reviews ({reviews.length})
          </button>

          <button
            onClick={() => setAdminTab('database')}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: adminTab === 'database' ? 'var(--accent-purple)' : 'transparent',
              color: adminTab === 'database' ? '#ffffff' : '#4b5563',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <Database size={15} /> Supabase Hub
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {adminTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div className="admin-card-panel" style={{ padding: '20px 18px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Inventory Value</span>
                <div style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 800, color: '#111827', margin: '4px 0' }}>
                  {formatPrice(totalValuation)}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>{vehicles.length} active catalog units</span>
              </div>

              <div className="admin-card-panel" style={{ padding: '20px 18px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Active Reservations</span>
                <div style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 800, color: 'var(--accent-purple)', margin: '4px 0' }}>
                  {orders.length}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>${totalDeposits.toLocaleString()} deposits in escrow</span>
              </div>

              <div className="admin-card-panel" style={{ padding: '20px 18px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Brand New Allocations</span>
                <div style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 800, color: '#2563eb', margin: '4px 0' }}>
                  {vehicles.filter(v => v.condition === 'Brand New').length}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>2026 Factory MSO units</span>
              </div>

              <div className="admin-card-panel" style={{ padding: '20px 18px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Bank Repos & Deals</span>
                <div style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.85rem)', fontWeight: 800, color: '#e11d48', margin: '4px 0' }}>
                  {vehicles.filter(v => v.condition === 'Bank Seized / Repo' || v.is_hot_deal).length}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Liquidation inventory</span>
              </div>
            </div>

            {/* Live Database Status Banner */}
            <div className="admin-card-panel" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ flex: '1 1 260px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                    Supabase Database Status
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '4px', wordBreak: 'break-all' }}>
                    Instance: <code>{SUPABASE_URL}</code>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '420px' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: supabaseHealth?.connected ? '#d1fae5' : '#fee2e2',
                    color: supabaseHealth?.connected ? '#059669' : '#b91c1c',
                    flex: '1 1 auto',
                    textAlign: 'center',
                  }}>
                    {supabaseHealth?.connected ? '✓ Supabase Online' : '● Supabase Standby'}
                  </span>
                  <button onClick={() => setAdminTab('database')} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '0.82rem', flex: '1 1 auto', justifyContent: 'center' }}>
                    Manage Database & SQL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* TAB 2: VEHICLES CRUD */}
        {adminTab === 'vehicles' && (
          <div className="admin-card-panel">
            <div className="admin-tab-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div className="admin-search-wrapper">
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#9ca3af' }} />
                <input
                  type="text"
                  className="input"
                  placeholder="Search vehicles by name, VIN, make..."
                  value={vehicleSearch}
                  onChange={e => setVehicleSearch(e.target.value)}
                  style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem' }}
                />
              </div>

              <button onClick={openAddVehicle} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontSize: '0.875rem' }}>
                <Plus size={16} /> Add New Vehicle
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="admin-table-desktop">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb', color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 8px' }}>Vehicle</th>
                    <th style={{ padding: '12px 8px' }}>Condition</th>
                    <th style={{ padding: '12px 8px' }}>Price</th>
                    <th style={{ padding: '12px 8px' }}>Mileage</th>
                    <th style={{ padding: '12px 8px' }}>VIN</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map(veh => (
                    <tr key={veh.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={veh.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=120&q=80'}
                            alt={veh.name}
                            style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover', background: '#f3f4f6' }}
                          />
                          <div>
                            <strong style={{ color: '#111827', display: 'block' }}>{veh.name}</strong>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{veh.year} • {veh.trim || veh.model}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: veh.condition === 'Brand New' ? '#ede9fe' : veh.condition === 'Bank Seized / Repo' ? '#ffe4e6' : '#ecfdf5',
                          color: veh.condition === 'Brand New' ? 'var(--accent-purple)' : veh.condition === 'Bank Seized / Repo' ? '#e11d48' : '#059669',
                        }}>
                          {veh.condition}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 800, color: '#111827' }}>
                        {formatPrice(veh.price)}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#4b5563' }}>
                        {veh.mileage}
                      </td>
                      <td style={{ padding: '12px 8px', color: '#6b7280', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        {veh.vin}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <button
                          onClick={() => toggleVehicleSold(veh.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
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
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
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
            <div className="admin-mobile-cards">
              {filteredVehicles.map(veh => (
                <div key={veh.id} style={{ border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', padding: '12px', background: '#f9fafb' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <img
                      src={veh.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=160&q=80'}
                      alt={veh.name}
                      style={{ width: '64px', height: '48px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0, background: '#e5e7eb' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: '0.88rem', color: '#111827', lineHeight: 1.25, display: 'block', wordBreak: 'break-word' }}>
                        {veh.name}
                      </strong>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                        {veh.year} • {veh.trim || veh.model} • {veh.mileage}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111827' }}>{formatPrice(veh.price)}</span>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: 'var(--radius-full)',
                          background: veh.condition === 'Brand New' ? '#ede9fe' : veh.condition === 'Bank Seized / Repo' ? '#ffe4e6' : '#ecfdf5',
                          color: veh.condition === 'Brand New' ? 'var(--accent-purple)' : veh.condition === 'Bank Seized / Repo' ? '#e11d48' : '#059669',
                        }}>
                          {veh.condition}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
                    <button
                      onClick={() => toggleVehicleSold(veh.id)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-full)',
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
                        style={{ padding: '6px 10px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}
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
                        style={{ padding: '6px 10px', fontSize: '0.78rem' }}
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
          <div className="admin-card-panel">
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
                      padding: '5px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: orderFilter === st ? '1px solid var(--accent-purple)' : '1px solid #e5e7eb',
                      background: orderFilter === st ? '#ede9fe' : '#ffffff',
                      color: orderFilter === st ? 'var(--accent-purple)' : '#4b5563',
                      fontWeight: 700,
                      fontSize: '0.75rem',
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
                      background: '#f9fafb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '14px',
                    }}
                  >
                    <div style={{ flex: '1 1 280px', minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>#{ord.order_number}</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: '#ede9fe', color: 'var(--accent-purple)' }}>
                          {ord.status}
                        </span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: '#ecfdf5', color: '#059669' }}>
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
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                No orders matching filter "{orderFilter}".
              </div>
            )}
          </div>
        )}
        {/* TAB 4: BLOG & POSTS */}
        {adminTab === 'posts' && (
          <div className="admin-card-panel">
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
                <Plus size={16} /> New Article
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
                    background: '#f9fafb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: '1 1 260px', minWidth: 0 }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase' }}>
                      {post.category}
                    </span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: '4px 0 2px', wordBreak: 'break-word' }}>
                      {post.title}
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                      Author: {post.author} • {post.read_minutes} min read
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
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
                      <Edit size={13} /> Edit
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

        {/* TAB 5: REVIEWS */}
        {adminTab === 'reviews' && (
          <div className="admin-card-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Verified Customer Reviews ({reviews.length})
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
                <Plus size={16} /> Add Verified Review
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
                    background: '#f9fafb',
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

        {/* TAB 6: DATABASE & SUPABASE MIGRATION HUB */}
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

            {/* Error explanation and fix note */}
            <div style={{ background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 'var(--radius-lg)', padding: '18px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-purple)', fontWeight: 800, marginBottom: '6px', fontSize: '0.9rem' }}>
                <ShieldCheck size={18} />
                <span>SQL Schema Error Resolved: ERROR 22001 (value too long for character varying)</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: 1.55, margin: 0 }}>
                The original PostgreSQL schema defined columns as <code>VARCHAR(100)</code>, which threw error <code>22001</code> when inserting long descriptive model names. In the updated <code>public/schema_and_seed.sql</code>, all string columns are defined as native PostgreSQL <code>TEXT</code>, and public RLS access policies are pre-configured.
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

            {/* Downloads & Danger Zone */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button onClick={handleDownloadSQL} className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 12px' }}>
                  <Download size={14} /> Download SQL
                </button>
                <button onClick={handleExportJSON} className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '8px 12px' }}>
                  <FileText size={14} /> Export JSON
                </button>
              </div>

              <button
                onClick={() => {
                  if (confirm('Reset all vehicle data, posts, reviews, and orders back to initial defaults?')) {
                    resetAllData();
                    alert(`System data reset to initial ${vehicles.length} vehicles.`);
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

                <div className="admin-form-grid-3">
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

                <div className="admin-form-grid-3">
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

                <div className="admin-form-grid-2">
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
                <div className="admin-form-grid-2">
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
    </div>
  );
};

