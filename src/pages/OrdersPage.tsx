import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  Calendar,
  DollarSign,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { orders, formatPrice } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);

  // Filter orders by order_number or email
  const searchedOrders = orders.filter(o => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      o.order_number.toLowerCase().includes(q) ||
      o.customer?.email?.toLowerCase().includes(q) ||
      o.customer?.fullName?.toLowerCase().includes(q) ||
      o.vehicle?.name?.toLowerCase().includes(q)
    );
  });

  const activeDisplayOrder = selectedOrder || (orders.length > 0 ? orders[0] : null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ background: '#f7f7f8', minHeight: '85vh', padding: '36px 0 80px' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#6b7280', marginBottom: '20px' }}>
          <Link to="/" style={{ color: '#6b7280', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <span style={{ color: '#111827', fontWeight: 600 }}>Track Order & Reservations</span>
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Live Reservation Status
          </span>
          <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#111827', marginTop: '4px', marginBottom: '8px' }}>
            Track Your Vehicle Order & Delivery
          </h1>
          <p style={{ color: '#4b5563', fontSize: '0.95rem' }}>
            Enter your order tracking number (e.g., <code>UC-849201</code>) or customer email to view live carrier dispatch updates.
          </p>

          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: '440px', margin: '20px auto 0' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '14px', color: '#9ca3af' }} />
            <input
              type="text"
              className="input"
              placeholder="Search by Order # (e.g. UC-849201) or Email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px', height: '46px', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>

        {/* If an active order is selected/found */}
        {activeDisplayOrder ? (
          <div className="card-panel" style={{ padding: '28px 20px', boxShadow: '0 4px 6px rgba(0,0,0,0.03)', marginBottom: '32px' }}>
            {/* Top Bar: Order ID + Status Badge + Print */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb', marginBottom: '28px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700 }}>
                  Order Reference
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  {activeDisplayOrder.order_number}
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '2px' }}>
                  Placed on {new Date(activeDisplayOrder.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: activeDisplayOrder.status === 'Delivered' ? '#d1fae5' : activeDisplayOrder.status === 'Cancelled' ? '#ffe4e6' : '#ede9fe',
                  color: activeDisplayOrder.status === 'Delivered' ? '#059669' : activeDisplayOrder.status === 'Cancelled' ? '#e11d48' : 'var(--accent-purple)',
                }}>
                  ● {activeDisplayOrder.status}
                </span>

                <button onClick={handlePrint} className="btn btn-secondary" style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                  <Printer size={15} /> Print Receipt
                </button>
              </div>
            </div>

            {/* Visual 4-Step Progress Bar */}
            <div style={{ margin: '28px 0 36px' }}>
              <div className="order-progress-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', textAlign: 'center', position: 'relative' }}>
                {/* Step 1: Deposit */}
                <div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#059669', color: '#fff', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={18} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827' }}>Deposit Received</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>$500 Hold Verified</div>
                </div>

                {/* Step 2: Verification */}
                <div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: activeDisplayOrder.status !== 'Pending' ? '#059669' : '#e5e7eb', color: activeDisplayOrder.status !== 'Pending' ? '#fff' : '#9ca3af', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827' }}>Title & Inspection</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>VIN Verified Clean</div>
                </div>

                {/* Step 3: Carrier Dispatched */}
                <div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: activeDisplayOrder.status === 'Delivered' ? '#059669' : activeDisplayOrder.status === 'Confirmed' ? 'var(--accent-purple)' : '#e5e7eb', color: activeDisplayOrder.status === 'Confirmed' || activeDisplayOrder.status === 'Delivered' ? '#fff' : '#9ca3af', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={18} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827' }}>Carrier Dispatched</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Enclosed Transport</div>
                </div>

                {/* Step 4: Delivery */}
                <div>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: activeDisplayOrder.status === 'Delivered' ? '#059669' : '#e5e7eb', color: activeDisplayOrder.status === 'Delivered' ? '#fff' : '#9ca3af', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={18} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#111827' }}>VIP Delivery</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>Driveway Handover</div>
                </div>
              </div>
            </div>

            {/* Vehicle & Customer Details Grid */}
            <div className="order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', background: '#f9fafb', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid #e5e7eb' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Reserved Vehicle</span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: '4px 0 10px' }}>
                  {activeDisplayOrder.vehicle?.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#4b5563' }}>
                  <div><strong>Transaction Type:</strong> {activeDisplayOrder.type}</div>
                  <div><strong>Hold Amount:</strong> {formatPrice(activeDisplayOrder.amount || 500)}</div>
                  <div><strong>Payment Method:</strong> {activeDisplayOrder.paymentMethod}</div>
                  <div><strong>Delivery Option:</strong> {activeDisplayOrder.deliveryOption}</div>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Customer & Destination</span>
                <div style={{ fontWeight: 800, color: '#111827', margin: '4px 0 8px', fontSize: '1.05rem' }}>
                  {activeDisplayOrder.customer?.fullName}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: '#4b5563' }}>
                  <div><strong>Email:</strong> {activeDisplayOrder.customer?.email}</div>
                  <div><strong>Phone:</strong> {activeDisplayOrder.customer?.phone}</div>
                  <div><strong>Address:</strong> {activeDisplayOrder.customer?.address}, {activeDisplayOrder.customer?.city}, {activeDisplayOrder.customer?.state} {activeDisplayOrder.customer?.zipCode}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-panel" style={{ textAlign: 'center', padding: '48px 16px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', marginBottom: '32px' }}>
            <Package size={44} style={{ color: '#9ca3af', marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
              No Orders Found Matching "{searchQuery}"
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 20px' }}>
              You haven't reserved any vehicles yet. Explore our inventory and reserve any car with a refundable $500 hold.
            </p>
            <Link to="/inventory" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              Browse All Vehicles For Sale
            </Link>
          </div>
        )}

        {/* All Recent Orders List */}
        {orders.length > 1 && (
          <div className="card-panel" style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-xl)', padding: '24px 18px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
              All System Orders ({orders.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {searchedOrders.map(ord => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    border: activeDisplayOrder?.id === ord.id ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                    background: activeDisplayOrder?.id === ord.id ? '#f5f3ff' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <strong style={{ color: '#111827', fontSize: '0.95rem' }}>{ord.order_number}</strong> — {ord.vehicle?.name}
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>
                      Customer: {ord.customer?.fullName} ({ord.customer?.email})
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                      {formatPrice(ord.amount || 500)}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 'var(--radius-full)', background: '#ede9fe', color: 'var(--accent-purple)' }}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

