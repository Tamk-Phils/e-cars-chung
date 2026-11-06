import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import type { PaymentMethod } from '../types';
import {
  X,
  ShieldCheck,
  Truck,
  Coins,
  CheckCircle2,
  FileText,
  Printer,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Mail,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    checkoutVehicle,
    setCheckoutVehicle,
    formatPrice,
    createOrder,
    toggleVehicleSold,
  } = useStore();

  const [step, setStep] = useState<'details' | 'success'>('details');
  const [orderType, setOrderType] = useState<'Reservation Deposit' | 'Full Payment' | 'Finance Application'>('Reservation Deposit');
  const [deliveryOption, setDeliveryOption] = useState<'Nationwide Home Delivery' | 'Showroom Pickup'>('Nationwide Home Delivery');
  
  // Strict Payment Methods requested: Zelle, Cash App, PayPal, Apple Pay, Chime, Crypto
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Zelle');

  // Customer Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeInDetails, setTradeInDetails] = useState('');
  const [notes, setNotes] = useState('');

  // Completed order state
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!checkoutVehicle) return null;

  const depositAmount = 500;
  const totalAmount = orderType === 'Reservation Deposit' ? depositAmount : checkoutVehicle.price;

  const availablePaymentMethods: { id: PaymentMethod; label: string; badge: string; icon: string }[] = [
    { id: 'Zelle', label: 'Zelle', badge: 'Instant Transfer', icon: '⚡' },
    { id: 'Cash App', label: 'Cash App', badge: '$ChungMotorsHoldings', icon: '🟢' },
    { id: 'PayPal', label: 'PayPal', badge: 'Buyer Protected', icon: '🅿️' },
    { id: 'Apple Pay', label: 'Apple Pay', badge: 'Apple Cash / 1-Tap', icon: '🍎' },
    { id: 'Chime', label: 'Chime', badge: '$ChungMotors', icon: '💚' },
    { id: 'Crypto (USDC/BTC)', label: 'Crypto (USDC / BTC)', badge: 'Decentralized Escrow', icon: '🪙' },
  ];

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const order = await createOrder({
      customer: {
        fullName,
        email,
        phone,
        address,
        city,
        state: stateVal,
        zipCode,
      },
      vehicle: {
        id: checkoutVehicle.id,
        name: checkoutVehicle.name,
        slug: checkoutVehicle.slug,
        price: checkoutVehicle.price,
        image: checkoutVehicle.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
        condition: checkoutVehicle.condition,
        year: checkoutVehicle.year,
      },
      type: orderType,
      amount: totalAmount,
      paymentMethod,
      deliveryOption,
      hasTradeIn,
      tradeInDetails: hasTradeIn ? tradeInDetails : undefined,
      notes: notes || undefined,
      status: 'Deposit Paid',
    });

    // Mark vehicle as reserved
    toggleVehicleSold(checkoutVehicle.id);

    setCompletedOrder(order);
    setStep('success');
  };

  const handlePrint = () => {
    window.print();
  };

  const adminEmail = 'sales@chungmotors.com';
  const adminPhone = '(800) 845-2886';

  const mailtoSubject = encodeURIComponent(`Reservation Order #${completedOrder?.order_number} - ${completedOrder?.vehicle?.name}`);
  const mailtoBody = encodeURIComponent(
    `Hello Chung Motors Admin,\n\nI have placed a reservation order for the ${completedOrder?.vehicle?.name} (Order #${completedOrder?.order_number}).\n\nCustomer Details:\n- Name: ${completedOrder?.customer?.fullName}\n- Phone: ${completedOrder?.customer?.phone}\n- Email: ${completedOrder?.customer?.email}\n- Delivery Address: ${completedOrder?.customer?.address}, ${completedOrder?.customer?.city}, ${completedOrder?.customer?.state} ${completedOrder?.customer?.zipCode}\n\nPayment Method Selected: ${completedOrder?.paymentMethod}\nAmount Due: $${completedOrder?.amount}\n\nPlease send me the exact payment transfer details and confirm vehicle delivery schedule.\n\nThank you!`
  );

  return (
    <div className="modal-backdrop" onClick={() => setCheckoutVehicle(null)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '720px',
          width: '95%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          background: '#ffffff',
          color: '#111827',
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '14px', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-purple)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Official Vehicle Reservation
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#111827', margin: 0 }}>
              {step === 'details' ? 'Secure & Reserve Vehicle Online' : 'Reservation Order Confirmed'}
            </h2>
          </div>
          <button
            onClick={() => setCheckoutVehicle(null)}
            style={{
              background: '#f3f4f6',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#4b5563',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Vehicle Summary Banner */}
            <div
              style={{
                display: 'flex',
                gap: '14px',
                alignItems: 'center',
                background: '#f9fafb',
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e5e7eb',
                flexWrap: 'wrap',
              }}
            >
              <img
                src={checkoutVehicle.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80'}
                alt={checkoutVehicle.name}
                style={{ width: '84px', height: '58px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }}
              />
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  {checkoutVehicle.name}
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '2px' }}>
                  VIN: {checkoutVehicle.vin} • {checkoutVehicle.mileage} • {checkoutVehicle.title_status}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>
                  {formatPrice(checkoutVehicle.price)}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>
                  Hold for $500 Deposit
                </span>
              </div>
            </div>

            {/* 1. Order Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                1. SELECT TRANSACTION TYPE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                {[
                  { id: 'Reservation Deposit', title: '$500 Refundable Hold', sub: 'Locks vehicle for 7 days while arranging delivery' },
                  { id: 'Full Payment', title: 'Full Vehicle Purchase', sub: `Pay full cash price: ${formatPrice(checkoutVehicle.price)}` },
                ].map(item => (
                  <div
                    key={item.id}
                    onClick={() => setOrderType(item.id as any)}
                    style={{
                      border: orderType === item.id ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                      background: orderType === item.id ? '#f5f3ff' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#111827' }}>{item.title}</div>
                    <div style={{ fontSize: '0.74rem', color: '#6b7280', marginTop: '2px' }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Customer Information */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                2. PURCHASER CONTACT INFORMATION
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '3px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '3px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    className="input"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '3px' }}>Phone / Mobile *</label>
                  <input
                    type="tel"
                    required
                    className="input"
                    placeholder="(555) 000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '3px' }}>Delivery Street Address *</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="123 Ocean Avenue"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginTop: '10px' }} className="contact-form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '3px' }}>City *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="Atlanta"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '3px' }}>State *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="GA"
                    value={stateVal}
                    onChange={e => setStateVal(e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, marginBottom: '3px' }}>ZIP Code *</label>
                  <input
                    type="text"
                    required
                    className="input"
                    placeholder="30301"
                    value={zipCode}
                    onChange={e => setZipCode(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>
                3. DELIVERY PREFERENCE
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div
                  onClick={() => setDeliveryOption('Nationwide Home Delivery')}
                  style={{
                    border: deliveryOption === 'Nationwide Home Delivery' ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                    background: deliveryOption === 'Nationwide Home Delivery' ? '#f5f3ff' : '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Truck size={20} style={{ color: 'var(--accent-purple)' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Nationwide Enclosed Delivery</div>
                    <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>Delivered to your doorstep in 3-5 days</div>
                  </div>
                </div>

                <div
                  onClick={() => setDeliveryOption('Showroom Pickup')}
                  style={{
                    border: deliveryOption === 'Showroom Pickup' ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                    background: deliveryOption === 'Showroom Pickup' ? '#f5f3ff' : '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <ShieldCheck size={20} style={{ color: '#059669' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Showroom VIP Pickup</div>
                    <div style={{ fontSize: '0.74rem', color: '#6b7280' }}>Keys handoff and full vehicle walkaround</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Payment Method Selection (STRICT: Zelle, Cash App, PayPal, Apple Pay, Chime, Crypto) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                4. SELECT PAYMENT METHOD ({orderType === 'Reservation Deposit' ? '$500 Refundable Deposit' : formatPrice(checkoutVehicle.price)})
              </label>
              <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '10px' }}>
                Secure peer-to-peer and instant mobile transfer methods accepted. No credit card surcharges.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                {availablePaymentMethods.map(pm => (
                  <div
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    style={{
                      border: paymentMethod === pm.id ? '2px solid var(--accent-purple)' : '1px solid #e5e7eb',
                      background: paymentMethod === pm.id ? '#f5f3ff' : '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      padding: '10px 12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{pm.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#111827' }}>{pm.label}</div>
                      <div style={{ fontSize: '0.7rem', color: paymentMethod === pm.id ? 'var(--accent-purple)' : '#6b7280', fontWeight: 600 }}>{pm.badge}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Specific Payment Instruction Preview */}
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 'var(--radius-md)', padding: '14px', fontSize: '0.82rem', color: '#374151', lineHeight: 1.5 }}>
                {paymentMethod === 'Zelle' && (
                  <div>
                    <strong>⚡ Zelle Payment Instructions:</strong><br />
                    Send payment via Zelle directly to our verified corporate enrollment: <strong>payments@chungmotors.com</strong> or mobile <strong>(800) 845-2886</strong>. Include your name in the memo. An automated confirmation will be sent to the admin upon receipt.
                  </div>
                )}
                {paymentMethod === 'Cash App' && (
                  <div>
                    <strong>🟢 Cash App Payment Instructions:</strong><br />
                    Transfer payment to our official verified Cashtag: <strong>$ChungMotorsHoldings</strong>. In the "For" note, write your full name and vehicle name.
                  </div>
                )}
                {paymentMethod === 'PayPal' && (
                  <div>
                    <strong>🅿️ PayPal Payment Instructions:</strong><br />
                    Send transfer via PayPal to <strong>paypal@chungmotors.com</strong>. Complete protection and instant receipt generated.
                  </div>
                )}
                {paymentMethod === 'Apple Pay' && (
                  <div>
                    <strong>🍎 Apple Pay / Apple Cash Instructions:</strong><br />
                    Direct Apple Pay/Cash transfer to our direct dealership concierge at <strong>(800) 845-2886</strong> or <strong>sales@chungmotors.com</strong>.
                  </div>
                )}
                {paymentMethod === 'Chime' && (
                  <div>
                    <strong>💚 Chime Member Transfer:</strong><br />
                    Send instantly from your Chime app to tag: <strong>$ChungMotors</strong>. Zero fees and instant verification.
                  </div>
                )}
                {paymentMethod === 'Crypto (USDC/BTC)' && (
                  <div>
                    <strong>🪙 Cryptocurrency Escrow:</strong><br />
                    Accepting USDC (Solana / Ethereum) or Bitcoin (BTC). A direct escrow wallet address and QR code will be provided on confirmation.
                  </div>
                )}
              </div>
            </div>

            {/* Submit Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#6b7280', display: 'block' }}>Deposit Due Today:</span>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-purple)' }}>
                  ${totalAmount.toLocaleString()}.00
                </span>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '12px 28px', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>Confirm & Place Reservation</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        ) : (
          /* ─── SUCCESS SCREEN WITH ADMIN NOTIFICATION & CONTACT PROMPT ─── */
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#d1fae5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
              Reservation Order Dispatched!
            </h2>
            <p style={{ color: '#4b5563', fontSize: '0.9rem', maxWidth: '540px', margin: '0 auto 16px' }}>
              Congratulations! Your reservation order for the <strong>{completedOrder?.vehicle?.name}</strong> has been logged under reference <strong>#{completedOrder?.order_number}</strong>.
            </p>

            {/* 1. Automated Admin Email Notification Notice */}
            <div
              style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                maxWidth: '560px',
                margin: '0 auto 18px',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <Mail size={22} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.85rem', color: '#065f46', lineHeight: 1.5 }}>
                <strong>Automated Notification Dispatched to Admin:</strong><br />
                An instant order notification has been sent to the dealership management at <strong>{adminEmail}</strong>. Our dispatch team has received your order and contact details to begin processing.
              </div>
            </div>

            {/* 2. PROMPT TO CONTACT ADMIN DIRECTLY */}
            <div
              style={{
                background: '#eff6ff',
                border: '2px solid #93c5fd',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                maxWidth: '560px',
                margin: '0 auto 20px',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#1d4ed8' }}>
                <PhoneCall size={18} />
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                  Next Step: Contact Dealership Admin to Finalize Payment
                </h4>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#1e3a8a', lineHeight: 1.5, marginBottom: '14px' }}>
                To verify your <strong>{completedOrder?.paymentMethod}</strong> payment and schedule your delivery or pickup time, please reach out to the admin directly:
              </p>

              <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '12px 14px', border: '1px solid #bfdbfe', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ color: '#6b7280' }}>Admin Email: </span>
                  <a href={`mailto:${adminEmail}?subject=${mailtoSubject}&body=${mailtoBody}`} style={{ fontWeight: 800, color: '#2563eb', textDecoration: 'underline' }}>
                    {adminEmail}
                  </a>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Direct Phone / Text: </span>
                  <a href={`tel:8008452886`} style={{ fontWeight: 800, color: '#2563eb' }}>
                    {adminPhone}
                  </a>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }}>Order Reference: </span>
                  <strong style={{ color: '#111827' }}>#{completedOrder?.order_number}</strong>
                </div>
              </div>

              {/* Direct Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
                <a
                  href={`mailto:${adminEmail}?subject=${mailtoSubject}&body=${mailtoBody}`}
                  className="btn btn-primary"
                  style={{
                    flex: '1 1 200px',
                    padding: '10px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Mail size={16} />
                  <span>Email Admin Now</span>
                </a>
                <a
                  href="tel:8008452886"
                  className="btn btn-secondary"
                  style={{
                    flex: '1 1 160px',
                    padding: '10px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <PhoneCall size={16} />
                  <span>Call / Text Admin</span>
                </a>
              </div>
            </div>

            {/* Order Receipt Box */}
            <div
              style={{
                background: '#f9fafb',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #e5e7eb',
                padding: '16px',
                maxWidth: '560px',
                margin: '0 auto 20px',
                textAlign: 'left',
                fontSize: '0.82rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#6b7280' }}>Vehicle:</span>
                <strong>{completedOrder?.vehicle?.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#6b7280' }}>Delivery Option:</span>
                <span>{completedOrder?.deliveryOption}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#6b7280' }}>Selected Payment:</span>
                <strong>{completedOrder?.paymentMethod}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginTop: '6px' }}>
                <span style={{ fontWeight: 700 }}>Total Deposit:</span>
                <strong style={{ fontSize: '1rem', color: 'var(--accent-purple)' }}>
                  ${completedOrder?.amount?.toLocaleString()}.00
                </strong>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button onClick={handlePrint} className="btn btn-secondary" style={{ padding: '9px 18px', fontSize: '0.85rem' }}>
                <Printer size={15} /> Print Receipt
              </button>
              <button
                onClick={() => setCheckoutVehicle(null)}
                className="btn btn-primary"
                style={{ padding: '9px 24px', fontSize: '0.85rem' }}
              >
                Return to Showroom
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
