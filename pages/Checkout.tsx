import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Truck, ShieldCheck, Lock, CheckCircle2, CreditCard, Banknote } from 'lucide-react';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/cart/StripePaymentForm';
import PaypalPaymentForm from '../components/cart/PaypalPaymentForm';
import { Address } from '../types';
import { userService } from '../services/userService';
import Loader from '../components/common/Loader';
import { GatewaySetting } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// We'll initialize stripePromise dynamically inside the component
let stripePromise: Promise<any> | null = null;

const CheckoutForm: React.FC = () => {
  const { cart, subtotal, tax, shipping, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // Form states for manual entry fallback
  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');

  const [gateways, setGateways] = useState<GatewaySetting[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string>('');
  const [stripeReady, setStripeReady] = useState(false);
  const [paypalClientId, setPaypalClientId] = useState<string | null>(null);
  const [orderReadyForPaypal, setOrderReadyForPaypal] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      if (!email && user.email) setEmail(user.email);
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const [addrData, gwData] = await Promise.all([
          userService.getAddresses(),
          paymentService.getActiveSettings().catch(() => [])
        ]);

        setAddresses(addrData);
        const defaultAddr = addrData.find(a => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr._id);

        const activeGws = gwData.filter(g => g.isActive);
        setGateways(activeGws);

        if (activeGws.length > 0) {
          setSelectedGateway(activeGws[0].gateway);

          const stripeSetting = activeGws.find(g => g.gateway === 'stripe');
          if (stripeSetting) {
            const pk = stripeSetting.mode === 'live' ? stripeSetting.livePublishableKey : stripeSetting.testPublishableKey;
            if (pk) {
              stripePromise = loadStripe(pk);
              setStripeReady(true);
            }
          }

          const paypalSetting = activeGws.find(g => g.gateway === 'paypal');
          if (paypalSetting) {
            const pk = paypalSetting.mode === 'live' ? paypalSetting.livePublishableKey : paypalSetting.testPublishableKey;
            if (pk) {
              setPaypalClientId(pk);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load checkout data');
      }
    };
    fetchCheckoutData();
  }, []);

  const preparePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      let finalAddress = shippingAddress;
      if (selectedAddressId) {
        const addr = addresses.find(a => a._id === selectedAddressId);
        if (addr) {
          finalAddress = `${addr.fullName}, ${addr.streetAddress}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
        }
      }

      if (!finalAddress) throw new Error('Shipping address is required');

      // 1. Create order
      const orderData = {
        items: cart
          .filter(item => item.product)
          .map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.price
          })),
        shippingAddress: finalAddress,
        paymentMethod: selectedGateway === 'stripe' ? 'Stripe' : (selectedGateway === 'paypal' ? 'PayPal' : 'COD') as any,
        itemsPrice: subtotal,
        taxPrice: 0,
        shippingPrice: shipping,
        totalPrice: total
      };

      const order = await orderService.createOrder(orderData);

      // 2. Handle Payment logic
      if (selectedGateway === 'stripe') {
        const { clientSecret: secret } = await paymentService.createPaymentIntent(total, order._id);
        setClientSecret(secret);
        setIsProcessing(false);
      } else if (selectedGateway === 'paypal') {
        setOrderReadyForPaypal(order._id);
        setIsProcessing(false);
      } else {
        // Handle COD or others
        toast.success('Order placed successfully! Pay on delivery.', {
          duration: 5000,
          icon: '📦',
        });
        navigate('/order-confirmation', { state: { orderId: order._id } });
        clearCart();
      }

      // Store order info in session to handle post-payment
      sessionStorage.setItem('pendingOrderId', order._id);
    } catch (err: any) {
      setError(err.message || 'Checkout failed');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      const orderId = sessionStorage.getItem('pendingOrderId');
      if (!orderId) throw new Error('Order session expired');

      // Update order to paid
      await orderService.updateOrderToPaid(orderId, {
        id: paymentIntent.id || paymentIntent.payment_id || paymentIntent.paymentIntentId,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: email || paymentIntent.email_address
      });

      sessionStorage.removeItem('pendingOrderId');
      clearCart();
      toast.success('Payment successful! Your order is being processed.', {
        duration: 6000,
        icon: '✅',
      });
      navigate('/order-confirmation', { state: { orderId } });
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/products');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#eff0f5] pt-10 pb-4 md:pt-16 md:pb-8 font-sans text-[#212121]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Progress Stepper - Daraz Style */}
        <div className="flex items-center justify-center mb-10 max-w-2xl mx-auto">
          <div className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#f85606] text-white flex items-center justify-center text-xs font-bold ring-4 ring-orange-100">1</div>
              <span className="text-[11px] font-bold mt-2 text-[#f85606]">Cart</span>
            </div>
            <div className="flex-1 h-[2px] bg-[#f85606] mx-4 -mt-6" />
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#f85606] text-white flex items-center justify-center text-xs font-bold ring-4 ring-orange-100">2</div>
              <span className="text-[11px] font-bold mt-2 text-[#f85606]">Shipping</span>
            </div>
            <div className="flex-1 h-[2px] bg-gray-200 mx-4 -mt-6" />
            <div className="flex flex-col items-center opacity-40">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 text-gray-400 flex items-center justify-center text-xs font-bold">3</div>
              <span className="text-[11px] font-bold mt-2">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 70% */}
          <div className="lg:col-span-8 space-y-6">
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {!clientSecret && !orderReadyForPaypal ? (
              <>
                {/* Shipping Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-bold text-gray-800 uppercase tracking-tight">Deliver to:</h3>
                    {(addresses.length > 0 || selectedAddressId) && (
                      <button onClick={() => setSelectedAddressId('')} className="text-[#f85606] text-xs font-bold hover:underline uppercase">Edit</button>
                    )}
                  </div>

                  {addresses.length > 0 && selectedAddressId ? (
                    <div className="flex items-start gap-4 p-4 border border-orange-100 bg-orange-50/10 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-orange-100/50 flex items-center justify-center text-[#f85606]">
                        <Truck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900">{addresses.find(a => a._id === selectedAddressId)?.fullName}</p>
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-500 font-bold uppercase tracking-wider">Home</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {addresses.find(a => a._id === selectedAddressId)?.streetAddress}, {addresses.find(a => a._id === selectedAddressId)?.city}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 font-medium italic">Estimated delivery: 3-5 business days</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Email Address"
                          className="w-full bg-white border border-gray-200 p-4 rounded-lg focus:ring-1 focus:ring-[#f85606] focus:border-[#f85606] outline-none text-sm"
                        />
                        <input
                          required
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Mobile Number"
                          className="w-full bg-white border border-gray-200 p-4 rounded-lg focus:ring-1 focus:ring-[#f85606] focus:border-[#f85606] outline-none text-sm"
                        />
                      </div>
                      <textarea
                        required
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        placeholder="Full Address (House#, Street, Area, City, Region)"
                        className="w-full bg-white border border-gray-200 p-4 rounded-lg focus:ring-1 focus:ring-[#f85606] focus:border-[#f85606] outline-none text-sm h-24 resize-none"
                      />
                    </div>
                  )}
                </div>

                {/* Items Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-gray-800 uppercase mb-6 tracking-tight flex items-center gap-3">
                    Store Order
                    <span className="text-[10px] font-bold text-gray-400 normal-case bg-gray-100 px-2 py-1 rounded">Seller: Avenly Home</span>
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {cart.map(item => {
                      if (!item.product) return null;
                      const productImage = item.product.images?.[0]?.url || item.product.image || item.image;
                      return (
                        <div key={item.id} className="py-6 flex gap-6 group">
                          <div className="w-20 h-24 bg-gray-50 rounded shadow-inner overflow-hidden flex-shrink-0">
                            <img src={productImage} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 mb-1 leading-snug group-hover:text-[#f85606] transition-colors">{item.name}</h4>
                            <p className="text-[11px] text-gray-400 font-medium mb-3">Model: Standard Edition | Color: Natural Sand</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">Qty: <span className="text-gray-900 font-bold">{item.quantity}</span></p>
                              <div className="text-right">
                                <p className="text-base font-bold text-[#f85606]">${(item.price * item.quantity).toFixed(2)}</p>
                                {item.product?.discount > 0 && (
                                  <p className="text-[10px] text-gray-400 line-through decoration-rose-400/20">${(item.product.price * item.quantity).toFixed(2)}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method - Daraz Style Cards */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="text-base font-bold text-gray-800 uppercase mb-6 tracking-tight">Select Payment Method</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gateways.filter(gw => gw.gateway !== 'stripe').map(gw => (
                      <button
                        key={gw.gateway}
                        type="button"
                        onClick={() => setSelectedGateway(gw.gateway)}
                        className={`p-4 border-2 rounded-xl text-center transition-all relative group flex flex-col items-center justify-center gap-3 hover:bg-orange-50/30 ${selectedGateway === gw.gateway ? 'border-[#f85606] bg-orange-50/30 ring-4 ring-orange-100/50' : 'border-gray-50'}`}
                      >
                        {selectedGateway === gw.gateway && (
                          <div className="absolute top-2 right-2 text-[#f85606]">
                            <CheckCircle2 className="h-4 w-4" />
                          </div>
                        )}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedGateway === gw.gateway ? 'text-[#f85606]' : 'text-gray-300'}`}>
                          {gw.gateway === 'paypal' ? (
                            <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="h-8" />
                          ) : <Banknote className="h-8 w-8" />}
                        </div>
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${selectedGateway === gw.gateway ? 'text-[#f85606]' : 'text-gray-400'}`}>
                          {gw.gateway === 'paypal' ? 'Pay with PayPal' : 'Pay on Delivery'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Payment Finalization Card */
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#f85606] text-white flex items-center justify-center text-lg font-bold">3</div>
                  <h3 className="text-xl font-bold text-gray-800">Complete Modern Payment</h3>
                </div>

                <div className="p-6 bg-[#f7f8fa] rounded-xl border border-gray-100">
                  {clientSecret && stripePromise && (
                    <Elements stripe={stripePromise}>
                      <StripePaymentForm
                        total={total}
                        clientSecret={clientSecret}
                        onSuccess={handlePaymentSuccess}
                        onError={(msg) => setError(msg)}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                      />
                    </Elements>
                  )}
                  {orderReadyForPaypal && paypalClientId && (
                    <PaypalPaymentForm
                      total={total}
                      orderId={orderReadyForPaypal}
                      onSuccess={handlePaymentSuccess}
                      onError={(msg) => setError(msg)}
                      clientId={paypalClientId}
                    />
                  )}
                </div>

                <button
                  onClick={() => {
                    setClientSecret(null);
                    setOrderReadyForPaypal(null);
                  }}
                  className="mt-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-[#f85606] transition-colors flex items-center gap-2"
                >
                  ← Modify Order Details
                </button>
              </div>
            )}
          </div>

          {/* Right Column: 30% - Sticky Order Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-bold text-gray-800 uppercase mb-6 tracking-tight border-b border-gray-50 pb-4">Order Summary</h3>

              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Items Total ({cart.length})</span>
                  <span className="font-bold text-gray-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Shipping Fee</span>
                  <span className={`font-bold ${shipping === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Promo Code Input - Integrated */}
              <div className="flex gap-2 mb-8 p-3 bg-gray-50 rounded-lg">
                <input type="text" placeholder="Promo Code?" className="flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-gray-300" />
                <button className="bg-[#f85606]/10 text-[#f85606] text-[10px] font-bold uppercase px-3 py-2 rounded hover:bg-[#f85606]/20 transition-colors">Apply</button>
              </div>

              <div className="pt-6 border-t border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-bold text-gray-900">Total Payment</span>
                  <span className="text-2xl font-bold text-[#f85606] tracking-tight">${total.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium text-right italic">GST Included where applicable</p>
              </div>

              {!clientSecret && !orderReadyForPaypal && (
                <button
                  onClick={preparePayment}
                  disabled={isProcessing}
                  className="w-full bg-[#f85606] text-white py-4 rounded font-bold text-sm uppercase tracking-widest hover:bg-[#d04a05] transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isProcessing ? <Loader size="sm" color="white" /> : 'Place Order'}
                </button>
              )}

              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
                <div className="flex items-center gap-4 text-[#f85606]/80">
                  <ShieldCheck className="h-6 w-6" />
                  <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">Genuine Product and Secure Protocol Active</p>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <Lock className="h-6 w-6" />
                  <p className="text-[10px] font-bold uppercase tracking-wider leading-relaxed">Payment Data is Encrypted via 256-bit SSL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/30">
      <CheckoutForm />
    </div>
  );
};

export default Checkout;
