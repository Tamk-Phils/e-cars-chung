import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  Building,
  Coins,
  CheckCircle2,
  FileText,
  Printer,
  ShoppingBag,
  ArrowRight,
  Sparkles,
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
  const [paymentMethod, setPaymentMethod] = useState<'Credit Card (Stripe simulation)' | 'Bank Wire' | 'Crypto (USDC/USDT)' | 'Dealership Financing'>('Credit Card (Stripe simulation)');

  // Form states
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

  // Payment mock inputs
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Completed order state
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!checkoutVehicle) return null;

  const depositAmount = 500;
  const totalAmount = orderType === 'Reservation Deposit' ? depositAmount : checkoutVehicle.price;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const order = createOrder({
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
      status: orderType === 'Reservation Deposit' ? 'Deposit Paid' : 'Confirmed',
    });

    // Mark vehicle as reserved/sold
    toggleVehicleSold(checkoutVehicle.id);

    setCompletedOrder(order);
    setStep('success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={() => setCheckoutVehicle(null)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '820px', padding: 0 }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} style={{ color: 'var(--accent-cyan)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {step === 'details' ? 'Vehicle Reservation & Checkout' : 'Reservation Confirmed!'}
            </h2>
          </div>
          <button
            onClick={() => setCheckoutVehicle(null)}
            className="btn btn-secondary"
            style={{ padding: '6px 10px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px' }}>
          {step === 'details' ? (
            <form onSubmit={handleSubmitOrder}>
              {/* Order Summary Strip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px',
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                }}
              >
                <img
                  src={checkoutVehicle.images?.[0] || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80'}
                  alt={checkoutVehicle.name}
                  style={{ width: '100px', height: '65px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {checkoutVehicle.condition} • {checkoutVehicle.year}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{checkoutVehicle.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    VIN: {checkoutVehicle.vin} • Mileage: {checkoutVehicle.mileage || 'Low mi'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vehicle Price</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {formatPrice(checkoutVehicle.price)}
                  </div>
                </div>
              </div>

              {/* Step 1: Choose Order Type */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
                  1. SELECT CHECKOUT PREFERENCE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div
                    onClick={() => {
                      setOrderType('Reservation Deposit');
                      setPaymentMethod('Credit Card (Stripe simulation)');
                    }}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: orderType === 'Reservation Deposit' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      background: orderType === 'Reservation Deposit' ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>$500 Refundable Hold</span>
                      <span className="badge badge-brand-new" style={{ fontSize: '0.65rem' }}>MOST POPULAR</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      Lock this vehicle for 72 hours. Completely refundable if you change your mind during inspection.
                    </p>
                  </div>

                  <div
                    onClick={() => setOrderType('Full Payment')}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: orderType === 'Full Payment' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      background: orderType === 'Full Payment' ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Full Purchase</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatPrice(checkoutVehicle.price)}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      Direct wire or certified funds. Vehicle title transferred and immediate delivery dispatch.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setOrderType('Finance Application');
                      setPaymentMethod('Dealership Financing');
                    }}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      border: orderType === 'Finance Application' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      background: orderType === 'Finance Application' ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Finance / $0 Today</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>INSTANT APPROVAL</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                      Apply for 36-72 month competitive bank financing with rates from 4.9% APR.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Buyer & Shipping Information */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
                  2. BUYER & DELIVERY ADDRESS
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. Robert Vance"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="input"
                      placeholder="robert@example.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Phone / Mobile *
                    </label>
                    <input
                      type="tel"
                      className="input"
                      placeholder="+1 (555) 019-2834"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px' }} className="address-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Street Address *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="1234 Ocean Boulevard"
                      required
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="Miami"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      State *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="FL"
                      required
                      value={stateVal}
                      onChange={e => setStateVal(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      className="input"
                      placeholder="33139"
                      required
                      value={zipCode}
                      onChange={e => setZipCode(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Preference */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '8px' }}>
                  3. DELIVERY METHOD
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div
                    onClick={() => setDeliveryOption('Nationwide Home Delivery')}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: deliveryOption === 'Nationwide Home Delivery' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      background: deliveryOption === 'Nationwide Home Delivery' ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <Truck size={20} style={{ color: 'var(--accent-cyan)' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Free Nationwide Enclosed Delivery</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Delivered in 3-5 business days</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setDeliveryOption('Showroom Pickup')}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: deliveryOption === 'Showroom Pickup' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                      background: deliveryOption === 'Showroom Pickup' ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <Building size={20} style={{ color: '#38bdf8' }} />
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Showroom VIP Pickup</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Walkthrough with master technician</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional Trade-In Toggle */}
              <div style={{ marginBottom: '24px', background: 'var(--bg-secondary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={hasTradeIn}
                    onChange={e => setHasTradeIn(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
                  />
                  <span>Do you have a vehicle to trade in? (Get instant credit against purchase)</span>
                </label>

                {hasTradeIn && (
                  <div style={{ marginTop: '10px' }}>
                    <input
                      type="text"
                      className="input"
                      placeholder="Trade-in details: e.g. 2021 Honda Accord EX, 42k miles, Clean title, VIN..."
                      value={tradeInDetails}
                      onChange={e => setTradeInDetails(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Step 4: Payment Details Simulation */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px' }}>
                  4. PAYMENT METHOD ({orderType === 'Reservation Deposit' ? '$500 Refundable Deposit' : formatPrice(checkoutVehicle.price)})
                </label>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'Credit Card (Stripe simulation)', label: 'Credit Card', icon: CreditCard },
                    { id: 'Bank Wire', label: 'Bank Wire Transfer', icon: Building },
                    { id: 'Crypto (USDC/USDT)', label: 'Crypto (USDC)', icon: Coins },
                  ].map(pm => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 14px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          background: paymentMethod === pm.id ? 'var(--accent-cyan)' : 'var(--bg-secondary)',
                          color: paymentMethod === pm.id ? '#000' : 'var(--text-secondary)',
                          border: '1px solid var(--border-color)',
                          cursor: 'pointer',
                        }}
                      >
                        <Icon size={14} /> {pm.label}
                      </button>
                    );
                  })}
                </div>

                {paymentMethod === 'Credit Card (Stripe simulation)' && (
                  <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                          Card Number (Simulated)
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={cardNumber}
                          onChange={e => setCardNumber(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                          Expires
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={cardExp}
                          onChange={e => setCardExp(e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                          CVC
                        </label>
                        <input
                          type="text"
                          className="input"
                          value={cardCvc}
                          onChange={e => setCardCvc(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Bank Wire' && (
                  <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Official Bank Wire wiring instructions will be displayed on the confirmation receipt and emailed to {email || 'your email'} with escrow reference ID.
                  </div>
                )}

                {paymentMethod === 'Crypto (USDC/USDT)' && (
                  <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Pay seamlessly with USDC or USDT on Ethereum / Solana. A secure crypto escrow payment QR code will be generated on confirmation.
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due Today:</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    {orderType === 'Reservation Deposit' ? '$500.00 (Refundable)' : formatPrice(checkoutVehicle.price)}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 700 }}
                >
                  Confirm & Reserve Vehicle <ArrowRight size={18} />
                </button>
              </div>
            </form>
          ) : (
            /* Order Success View */
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={38} />
              </div>

              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
                Vehicle Reserved Successfully!
              </h2>

              <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
                Congratulations, your reservation for the <strong>{completedOrder?.vehicle?.name}</strong> has been secured.
                A confirmation has been dispatched to <strong>{completedOrder?.customer?.email}</strong>.
              </p>

              {/* Order Receipt Box */}
              <div
                style={{
                  background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '24px',
                  maxWidth: '560px',
                  margin: '0 auto 28px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order Reference Number</span>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--accent-cyan)' }}>
                    {completedOrder?.order_number}
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Vehicle</span>
                  <span>{completedOrder?.vehicle?.name}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Delivery Method</span>
                  <span>{completedOrder?.deliveryOption}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Deliver To</span>
                  <span>{completedOrder?.customer?.fullName}, {completedOrder?.customer?.city}, {completedOrder?.customer?.state}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Type</span>
                  <span>{completedOrder?.type} ({completedOrder?.paymentMethod})</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
                  <span style={{ fontWeight: 700 }}>Deposit Amount Charged</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    ${completedOrder?.amount?.toLocaleString()}.00
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button onClick={handlePrint} className="btn btn-secondary">
                  <Printer size={16} /> Print Receipt
                </button>
                <button onClick={() => setCheckoutVehicle(null)} className="btn btn-primary">
                  Return to Showroom
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .address-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
