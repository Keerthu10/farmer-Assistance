import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, ShoppingBag, 
  ArrowRight, ShieldCheck, Sparkles, Building2, 
  Store, Utensils, Globe2, UserCheck, CheckCircle2 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRegion } from '../../context/RegionContext';
import { useAuth } from '../../context/AuthContext';
import { BuyerType } from '../../types';

interface CartDrawerProps {
  onNavigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigate }) => {
  const { 
    items, removeFromCart, updateQuantity, clearCart, 
    subtotalAmount, farmerDirectSavings, farmerGainOverMandi, 
    isCartOpen, closeCart, createOrder 
  } = useCart();
  const { formatCurrency, currentRegion } = useRegion();
  const { user } = useAuth();

  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [buyerType, setBuyerType] = useState<BuyerType>('Individual');
  const [deliveryStreet, setDeliveryStreet] = useState<string>('14 Green Avenue, Near Clock Tower');
  const [deliveryDistrict, setDeliveryDistrict] = useState<string>(user?.district || currentRegion.defaultDistrict);
  const [deliveryState, setDeliveryState] = useState<string>(user?.state || currentRegion.defaultState);
  const [deliveryPincode, setDeliveryPincode] = useState<string>('141001');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Direct Card' | 'Escrow Bank Transfer' | 'Cash on Delivery'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccessCode, setOrderSuccessCode] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newOrder = await createOrder({
        buyerType,
        customerName: user?.name || 'Customer Buyer',
        customerEmail: user?.email || 'customer@agroassist.gov.in',
        customerPhone: user?.phone || '+91 98223 34455',
        deliveryAddress: {
          street: deliveryStreet,
          district: deliveryDistrict,
          state: deliveryState,
          pincode: deliveryPincode,
        },
        paymentMethod,
      });
      setOrderSuccessCode(newOrder.order_code);
      setTimeout(() => {
        setIsCheckingOut(false);
        setOrderSuccessCode(null);
        closeCart();
        onNavigate('/orders');
      }, 1800);
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 dark:text-white text-base">
                  {isCheckingOut ? 'Farm Direct Checkout' : 'Farm Direct Produce Cart'}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {items.length} unique produce item{items.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && !isCheckingOut && (
                <button
                  onClick={clearCart}
                  className="text-[11px] text-stone-400 hover:text-rose-500 font-medium transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={closeCart}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {orderSuccessCode ? (
              <div className="py-12 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-extrabold text-stone-900 dark:text-white">
                  Order Successfully Placed!
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs">
                  Order Code: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{orderSuccessCode}</span>.
                  Your payment is secured in escrow and will be released to the farmer once produce is verified.
                </p>
              </div>
            ) : isCheckingOut ? (
              /* Checkout Form */
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
                {/* Buyer Type Selector */}
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-2">
                    Select Your Buyer Category:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'Individual', label: 'Household', icon: UserCheck },
                      { type: 'Restaurant', label: 'Restaurant / Cafe', icon: Utensils },
                      { type: 'Supermarket', label: 'Supermarket', icon: Store },
                      { type: 'Wholesaler', label: 'Wholesale Buyer', icon: Building2 },
                    ].map((b) => {
                      const Icon = b.icon;
                      return (
                        <button
                          key={b.type}
                          type="button"
                          onClick={() => setBuyerType(b.type as BuyerType)}
                          className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                            buyerType === b.type
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold'
                              : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="text-[11px] truncate">{b.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    Delivery Address:
                  </span>
                  <div>
                    <label className="block text-[11px] text-stone-500 mb-1">Street / Landmark</label>
                    <input
                      type="text"
                      required
                      value={deliveryStreet}
                      onChange={(e) => setDeliveryStreet(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">District</label>
                      <input
                        type="text"
                        required
                        value={deliveryDistrict}
                        onChange={(e) => setDeliveryDistrict(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-stone-500 mb-1">Postal / Pin Code</label>
                      <input
                        type="text"
                        required
                        value={deliveryPincode}
                        onChange={(e) => setDeliveryPincode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Escrow Protected Payment Option */}
                <div className="space-y-2 pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span className="font-bold text-stone-800 dark:text-stone-200 block">
                    Escrow Protected Payment:
                  </span>
                  <div className="space-y-1.5">
                    {[
                      { id: 'UPI', label: 'Direct UPI Instant (Google Pay, PhonePe)', desc: 'Zero gateway fee' },
                      { id: 'Direct Card', label: 'Credit / Debit Card (Visa, RuPay)', desc: 'Instant authorization' },
                      { id: 'Escrow Bank Transfer', label: 'Commercial Escrow Bank Transfer', desc: 'Ideal for bulk orders' },
                      { id: 'Cash on Delivery', label: 'Cash on Farm Delivery (Pay after check)', desc: 'Inspect produce first' },
                    ].map((p) => (
                      <label
                        key={p.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          paymentMethod === p.id
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-100 font-semibold'
                            : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === p.id}
                            onChange={() => setPaymentMethod(p.id as any)}
                            className="text-emerald-600 focus:ring-emerald-500"
                          />
                          <div>
                            <span className="font-medium text-xs block">{p.label}</span>
                            <span className="text-[10px] text-stone-400">{p.desc}</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Escrow Guarantee Notice */}
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                    <strong>100% Farm-to-Fork Guarantee:</strong> Your payment remains securely locked in AgroAssist Escrow. The farmer only receives payout once you confirm receipt of fresh, undamaged produce.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-1/3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-bold hover:bg-stone-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Confirm & Place Order</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-700 dark:text-stone-300 text-sm">
                  Your cart is empty
                </h4>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Browse fresh produce directly from verified local farms in your district.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    onNavigate('/marketplace');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  Explore Farm Marketplace
                </button>
              </div>
            ) : (
              /* Item List */
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-3 rounded-2xl border border-stone-200/80 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50 flex gap-3 text-xs relative group"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                    />

                    <div className="flex-1 min-w-0 pr-6">
                      <h4 className="font-extrabold text-stone-900 dark:text-white truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
                        {item.product.farm_name}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-extrabold text-stone-900 dark:text-white">
                          {formatCurrency(item.product.price_per_unit)} <span className="text-[10px] text-stone-400 font-normal">/ {item.selectedUnit}</span>
                        </span>

                        {/* Stepper */}
                        <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="absolute top-2 right-2 p-1 text-stone-400 hover:text-rose-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Middleman Elimination & Impact Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Direct Farm-to-Customer Impact</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800/60">
                      <span className="text-stone-400 block text-[10px]">Your Savings vs Retail:</span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xs">
                        +{formatCurrency(farmerDirectSavings)}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-emerald-200 dark:border-emerald-800/60">
                      <span className="text-stone-400 block text-[10px]">Extra Farmer Margin:</span>
                      <span className="font-extrabold text-teal-600 dark:text-teal-400 text-xs">
                        +{formatCurrency(farmerGainOverMandi)}
                      </span>
                    </div>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight">
                    * By connecting directly, 0% commission goes to intermediary brokers or mandi middlemen.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Checkout Bar */}
          {items.length > 0 && !isCheckingOut && !orderSuccessCode && (
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/80 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>Produce Subtotal:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {formatCurrency(subtotalAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>Farm Cold-Chain Delivery:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {subtotalAmount > 1500 ? 'FREE' : formatCurrency(80)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-800">
                  <span>Total Due:</span>
                  <span>{formatCurrency(subtotalAmount > 1500 ? subtotalAmount : subtotalAmount + 80)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Direct Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
