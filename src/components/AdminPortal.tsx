import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { Vehicle, VehicleCondition, Order, Post } from '../types';
import {
  X,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit,
  Download,
  RotateCcw,
  CheckCircle,
  Clock,
  Car,
  FileText,
  DollarSign,
  ShoppingBag,
  Database,
  Search,
  Copy,
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    isAdminOpen,
    setIsAdminOpen,
    vehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicleSold,
    orders,
    updateOrderStatus,
    posts,
    addPost,
    deletePost,
    resetAllData,
    formatPrice,
  } = useStore();

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active admin tab
  const [adminTab, setAdminTab] = useState<'inventory' | 'orders' | 'posts' | 'database'>('inventory');

  // Vehicle editor modal state
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [vName, setVName] = useState('');
  const [vMake, setVMake] = useState('BMW');
  const [vModel, setVModel] = useState('M5');
  const [vYear, setVYear] = useState(2026);
  const [vCondition, setVCondition] = useState<VehicleCondition>('Brand New');
  const [vPrice, setVPrice] = useState(85000);
  const [vMileage, setVMileage] = useState('15 miles');
  const [vTransmission, setVTransmission] = useState('Automatic');
  const [vFuelType, setVFuelType] = useState('Gasoline');
  const [vBodyType, setVBodyType] = useState('Sedan');
  const [vVin, setVVin] = useState('1HGCR2F8X9281029');
  const [vTitleStatus, setVTitleStatus] = useState('Clean Title');
  const [vImageUrl, setVImageUrl] = useState('https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80');
  const [vDesc, setVDesc] = useState('Pristine vehicle with complete service history, clean title, and full warranty.');

  // Search filter inside admin inventory
  const [adminSearch, setAdminSearch] = useState('');

  if (!isAdminOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(username, password);
    if (!success) {
      setLoginError('Invalid credentials. Use admin / admin123');
    } else {
      setLoginError('');
    }
  };

  const openAddVehicleModal = () => {
    setEditingId(null);
    setVName('');
    setVMake('Porsche');
    setVModel('911');
    setVYear(2026);
    setVCondition('Brand New');
    setVPrice(150000);
    setVMileage('10 miles');
    setVTransmission('Automatic');
    setVFuelType('Gasoline');
    setVBodyType('Coupe');
    setVVin('WP0AB' + Math.floor(10000000 + Math.random() * 90000000));
    setVTitleStatus('Clean Title');
    setVImageUrl('https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80');
    setVDesc('Brand new high-performance model. Unregistered with complete factory warranty and enclosed nationwide delivery.');
    setIsEditingVehicle(true);
  };

  const openEditVehicleModal = (v: Vehicle) => {
    setEditingId(v.id);
    setVName(v.name);
    setVMake(v.make);
    setVModel(v.model);
    setVYear(v.year);
    setVCondition(v.condition);
    setVPrice(v.price);
    setVMileage(v.mileage || '');
    setVTransmission(v.transmission || 'Automatic');
    setVFuelType(v.fuel_type || 'Gasoline');
    setVBodyType(v.body_type || 'Sedan');
    setVVin(v.vin || '');
    setVTitleStatus(v.title_status || 'Clean Title');
    setVImageUrl(v.images?.[0] || '');
    setVDesc(v.description || '');
    setIsEditingVehicle(true);
  };

  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateVehicle(editingId, {
        name: vName,
        make: vMake,
        model: vModel,
        year: vYear,
        condition: vCondition,
        price: vPrice,
        mileage: vMileage,
        transmission: vTransmission,
        fuel_type: vFuelType,
        body_type: vBodyType,
        vin: vVin,
        title_status: vTitleStatus,
        images: [vImageUrl],
        description: vDesc,
      });
    } else {
      addVehicle({
        slug: (vName || `${vYear}-${vMake}-${vModel}`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: vName || `${vYear} ${vMake} ${vModel}`,
        make: vMake,
        model: vModel,
        year: vYear,
        condition: vCondition,
        price: vPrice,
        sale_price: null,
        down_payment: Math.round(vPrice * 0.1),
        mileage: vMileage,
        transmission: vTransmission,
        exterior_color: 'Metallic Finish',
        interior_color: 'Premium Leather',
        fuel_type: vFuelType,
        body_type: vBodyType,
        vin: vVin,
        title_status: vTitleStatus,
        trim: 'Premium Edition',
        description: vDesc,
        features: ['Certified 150-Point Inspection', 'Clean Title Guarantee', 'Enclosed Delivery'],
        images: [vImageUrl],
        is_hot_deal: vCondition === 'Bank Seized / Repo',
        is_sold: false,
        is_featured: true,
        sort_order: -50,
      });
    }
    setIsEditingVehicle(false);
  };

  const handleDownloadSQL = () => {
    const link = document.createElement('a');
    link.href = '/schema_and_seed.sql';
    link.download = 'schema_and_seed.sql';
    link.click();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ vehicles, orders, posts }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'usedcars_complete_backup.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered inventory inside admin
  const filteredAdminVehicles = vehicles.filter(v =>
    adminSearch === '' ||
    v.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    v.make.toLowerCase().includes(adminSearch.toLowerCase()) ||
    v.vin.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const totalInventoryValuation = vehicles.reduce((sum, v) => sum + v.price, 0);

  return (
    <div className="modal-backdrop" onClick={() => setIsAdminOpen(false)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '1180px', padding: 0 }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>UsedCars.com Management Portal</h2>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                System Administration & Database Controls
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {isAdmin && (
              <button
                onClick={logoutAdmin}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                <Unlock size={14} /> Log Out
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="btn btn-secondary"
              style={{ padding: '6px 10px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {!isAdmin ? (
            /* Login Gate */
            <div style={{ maxWidth: '380px', margin: '40px auto', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Lock size={28} />
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '6px' }}>Admin Login</h3>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Sign in with the configured credentials: <strong>admin</strong> / <strong>admin123</strong>
              </p>

              {loginError && (
                <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', marginBottom: '14px' }}>
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Username
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div style={{ textAlign: 'left' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Password
                  </label>
                  <input
                    type="password"
                    className="input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '8px', padding: '12px' }}>
                  Access Admin Dashboard
                </button>
              </form>
            </div>
          ) : (
            /* Logged In Dashboard */
            <div>
              {/* Top Overview KPI Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Total Inventory</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {vehicles.length} Vehicles
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    {vehicles.filter(v => v.condition === 'Brand New').length} Brand New • {vehicles.filter(v => v.is_sold).length} Sold
                  </span>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Inventory Value</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ${(totalInventoryValuation / 1000000).toFixed(2)}M
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Active wholesale & retail
                  </span>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Reservations & Orders</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                    {orders.length} Placed
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    ${(orders.reduce((sum, o) => sum + o.amount, 0)).toLocaleString()} collected
                  </span>
                </div>

                <div style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Published Blog Articles</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa' }}>
                    {posts.length} Guides
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Full SEO Schema Enabled
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setAdminTab('inventory')}
                  className={`btn ${adminTab === 'inventory' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.825rem', padding: '8px 16px' }}
                >
                  <Car size={16} /> Manage Vehicles ({vehicles.length})
                </button>
                <button
                  onClick={() => setAdminTab('orders')}
                  className={`btn ${adminTab === 'orders' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.825rem', padding: '8px 16px' }}
                >
                  <ShoppingBag size={16} /> Orders & Reservations ({orders.length})
                </button>
                <button
                  onClick={() => setAdminTab('posts')}
                  className={`btn ${adminTab === 'posts' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.825rem', padding: '8px 16px' }}
                >
                  <FileText size={16} /> Blog Articles ({posts.length})
                </button>
                <button
                  onClick={() => setAdminTab('database')}
                  className={`btn ${adminTab === 'database' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ fontSize: '0.825rem', padding: '8px 16px' }}
                >
                  <Database size={16} /> SQL Schema & Exports
                </button>
              </div>

              {/* Tab 1: Inventory Table */}
              {adminTab === 'inventory' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                      <input
                        type="text"
                        className="input"
                        placeholder="Search stock by name, make, VIN..."
                        value={adminSearch}
                        onChange={e => setAdminSearch(e.target.value)}
                        style={{ paddingLeft: '34px' }}
                      />
                      <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-muted)' }} />
                    </div>

                    <button onClick={openAddVehicleModal} className="btn btn-primary">
                      <Plus size={16} /> Add New Vehicle
                    </button>
                  </div>

                  {/* Vehicles Table */}
                  <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '12px' }}>VEHICLE</th>
                          <th style={{ padding: '12px' }}>CONDITION</th>
                          <th style={{ padding: '12px' }}>PRICE</th>
                          <th style={{ padding: '12px' }}>MIL / TRANS</th>
                          <th style={{ padding: '12px' }}>VIN</th>
                          <th style={{ padding: '12px' }}>STATUS</th>
                          <th style={{ padding: '12px', textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAdminVehicles.map(v => (
                          <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)', background: v.is_sold ? 'rgba(244, 63, 94, 0.05)' : 'transparent' }}>
                            <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img
                                src={v.images?.[0]}
                                alt={v.name}
                                style={{ width: '48px', height: '34px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                              <div>
                                <div style={{ fontWeight: 700 }}>{v.name}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.year} • {v.make}</div>
                              </div>
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <span className={v.condition === 'Brand New' ? 'badge badge-brand-new' : v.is_hot_deal ? 'badge badge-hot-deal' : 'badge badge-certified'}>
                                {v.condition}
                              </span>
                            </td>
                            <td style={{ padding: '10px 12px', fontWeight: 700 }}>
                              {formatPrice(v.price)}
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                              {v.mileage} • {v.transmission}
                            </td>
                            <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                              {v.vin}
                            </td>
                            <td style={{ padding: '10px 12px' }}>
                              <button
                                onClick={() => toggleVehicleSold(v.id)}
                                style={{
                                  background: v.is_sold ? '#e11d48' : 'rgba(16, 185, 129, 0.2)',
                                  color: v.is_sold ? '#fff' : '#34d399',
                                  border: 'none',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                }}
                              >
                                {v.is_sold ? 'SOLD' : 'AVAILABLE'}
                              </button>
                            </td>
                            <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button
                                  onClick={() => openEditVehicleModal(v)}
                                  className="btn btn-secondary"
                                  style={{ padding: '6px 8px' }}
                                  title="Edit vehicle"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${v.name}?`)) {
                                      deleteVehicle(v.id);
                                    }
                                  }}
                                  className="btn btn-danger"
                                  style={{ padding: '6px 8px' }}
                                  title="Delete vehicle"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders & Reservations Table */}
              {adminTab === 'orders' && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
                    Customer Vehicle Reservations ({orders.length})
                  </h3>
                  {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <ShoppingBag size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                      <p style={{ color: 'var(--text-secondary)' }}>No reservations placed yet in this session.</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Place an order on any vehicle using the "Reserve" button to test the order tracking flow!</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.825rem' }}>
                        <thead>
                          <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '12px' }}>ORDER #</th>
                            <th style={{ padding: '12px' }}>CUSTOMER</th>
                            <th style={{ padding: '12px' }}>VEHICLE</th>
                            <th style={{ padding: '12px' }}>TYPE & AMOUNT</th>
                            <th style={{ padding: '12px' }}>DELIVERY</th>
                            <th style={{ padding: '12px' }}>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(o => (
                            <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '12px', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                                {o.order_number}
                              </td>
                              <td style={{ padding: '12px' }}>
                                <div style={{ fontWeight: 700 }}>{o.customer.fullName}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  {o.customer.email} • {o.customer.phone}
                                </div>
                              </td>
                              <td style={{ padding: '12px' }}>
                                {o.vehicle.name}
                              </td>
                              <td style={{ padding: '12px' }}>
                                <span style={{ fontWeight: 700 }}>${o.amount.toLocaleString()}</span>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{o.type}</div>
                              </td>
                              <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                                {o.deliveryOption}
                              </td>
                              <td style={{ padding: '12px' }}>
                                <select
                                  className="select"
                                  value={o.status}
                                  onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', width: 'auto' }}
                                >
                                  <option value="Deposit Paid">Deposit Paid</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Blog Posts */}
              {adminTab === 'posts' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>SEO Articles & Buyer Guides ({posts.length})</h3>
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {posts.map(p => (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '14px 18px',
                          background: 'var(--bg-secondary)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {p.category} • {p.read_minutes} min read
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Published by {p.author}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (confirm('Delete this article?')) deletePost(p.id);
                          }}
                          className="btn btn-danger"
                          style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Database & SQL Schema */}
              {adminTab === 'database' && (
                <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', padding: '20px 0' }}>
                  <Database size={48} style={{ color: 'var(--accent-cyan)', marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                    Database Migration & Schema Exporter
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
                    Ready to deploy to Supabase, PostgreSQL, or Neon? All 51 vehicles, 9 rich SEO guides, and 15 reviews
                    have been pre-compiled into an executable SQL migration script with proper DDL tables and data inserts.
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
                    <button
                      onClick={async () => {
                        try {
                          const resp = await fetch('/schema_and_seed.sql');
                          const text = await resp.text();
                          await navigator.clipboard.writeText(text);
                          alert('Copied fixed SQL script to clipboard! Paste it into Supabase SQL Editor.');
                        } catch {
                          handleDownloadSQL();
                        }
                      }}
                      className="btn btn-primary"
                      style={{ padding: '12px 22px' }}
                    >
                      <Copy size={16} /> Copy Fixed SQL Script (No VARCHAR Errors)
                    </button>
                    <button onClick={handleDownloadSQL} className="btn btn-secondary" style={{ padding: '12px 22px' }}>
                      <Download size={16} /> Download schema_and_seed.sql
                    </button>
                    <button onClick={handleExportJSON} className="btn btn-secondary" style={{ padding: '12px 22px' }}>
                      <FileText size={16} /> Export JSON Dataset
                    </button>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <a
                      href="/admin"
                      onClick={() => setIsAdminOpen(false)}
                      className="btn btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', textDecoration: 'none' }}
                    >
                      <Database size={16} /> Open Full-Screen Admin Dashboard
                    </a>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
                      Danger Zone
                    </span>
                    <button
                      onClick={() => {
                        if (confirm('Reset all vehicle data, posts, and orders back to initial defaults?')) {
                          resetAllData();
                          alert('System data reset to initial 51 vehicles.');
                        }
                      }}
                      className="btn btn-danger"
                      style={{ fontSize: '0.8rem', padding: '8px 16px' }}
                    >
                      <RotateCcw size={14} /> Reset All Data to Initial Demo State
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Vehicle Modal Sub-Drawer */}
      {isEditingVehicle && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '640px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {editingId ? 'Edit Vehicle Details' : 'Add New Vehicle to Inventory'}
              </h3>
              <button onClick={() => setIsEditingVehicle(false)} className="btn btn-secondary" style={{ padding: '6px 10px' }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Vehicle Name *</label>
                <input
                  type="text"
                  className="input"
                  required
                  placeholder="e.g. 2026 Porsche 911 GT3 RS"
                  value={vName}
                  onChange={e => setVName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Make *</label>
                  <input
                    type="text"
                    className="input"
                    required
                    value={vMake}
                    onChange={e => setVMake(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Model *</label>
                  <input
                    type="text"
                    className="input"
                    required
                    value={vModel}
                    onChange={e => setVModel(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Year *</label>
                  <input
                    type="number"
                    className="input"
                    required
                    value={vYear}
                    onChange={e => setVYear(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Condition *</label>
                  <select
                    className="select"
                    value={vCondition}
                    onChange={e => setVCondition(e.target.value as any)}
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Certified Pre-Owned">Certified Pre-Owned</option>
                    <option value="Used">Used</option>
                    <option value="Bank Seized / Repo">Bank Seized / Repo</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Price ($ USD) *</label>
                  <input
                    type="number"
                    className="input"
                    required
                    value={vPrice}
                    onChange={e => setVPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Mileage</label>
                  <input
                    type="text"
                    className="input"
                    value={vMileage}
                    onChange={e => setVMileage(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Transmission</label>
                  <input
                    type="text"
                    className="input"
                    value={vTransmission}
                    onChange={e => setVTransmission(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Fuel Type</label>
                  <input
                    type="text"
                    className="input"
                    value={vFuelType}
                    onChange={e => setVFuelType(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>High-Res Image URL</label>
                <input
                  type="url"
                  className="input"
                  value={vImageUrl}
                  onChange={e => setVImageUrl(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '4px' }}>Vehicle Description</label>
                <textarea
                  className="input"
                  rows={3}
                  value={vDesc}
                  onChange={e => setVDesc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsEditingVehicle(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
