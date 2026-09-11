import React, { useState } from 'react';
import { 
  PackageCheck, Truck, Clock, ShieldCheck, 
  CheckCircle2, Star, AlertTriangle, QrCode, 
  MapPin, User, ChevronRight, X, ArrowRight, 
  Building2, Utensils, Store, UserCheck, RefreshCw 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRegion } from '../../context/RegionContext';
import { MarketplaceOrder, OrderStatus } from '../../types';

interface OrdersPageProps {
  onNavigate: (path: string) => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ onNavigate }) => {
  const { orders, updateOrderStatus } = useCart();
  const { user } = useAuth();
  const { formatCurrency } = useRegion();

  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(orders[0] || null);
  const [reviewModalOrder, setReviewModalOrder] = useState<MarketplaceOrder | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>('Exceptional crispness and aroma! Plucked this morning and delivered right to our restaurant kitchen.');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const [disputeModalOrder, setDisputeModalOrder] = useState<MarketplaceOrder | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('Packaging damaged in transit or delayed delivery');
  const [disputeSuccess, setDisputeSuccess] = useState<boolean>(false);

  const isFarmer = user?.role === 'farmer';
  const isAdmin = user?.role === 'admin';

  // Filter orders based on user role
  const displayOrders = orders.filter((ord) => {
    if (isAdmin) return true;
    if (isFarmer) {
      // Farmer sees orders containing items from their farm
      return ord.farmer_ids.includes(user?.id || 1);
    }
    // Customer sees orders placed by them
    return true;
  });

  const handleConfirmDelivery = (orderId: number) => {
    updateOrderStatus(orderId, 'Delivered');
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        order_status: 'Delivered',
        payment_status: 'Released to Farmer',
      });
    }
  };

  const handleFarmerAdvanceStatus = (orderId: number, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = currentStatus;
    if (currentStatus === 'Pending' || currentStatus === 'Confirmed') nextStatus = 'Packed';
    else if (currentStatus === 'Packed') nextStatus = 'Dispatched';
    else if (currentStatus === 'Dispatched') nextStatus = 'Delivered';

    updateOrderStatus(orderId, nextStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        order_status: nextStatus,
        payment_status: nextStatus === 'Delivered' ? 'Released to Farmer' : selectedOrder.payment_status,
      });
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewSubmitted(false);
      setReviewModalOrder(null);
    }, 1600);
  };

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSuccess(true);
    setTimeout(() => {
      setDisputeSuccess(false);
      setDisputeModalOrder(null);
    }, 1600);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Escrow Protected Supply Chain</span>
          </div>
          <h1 className="text-2xl font-extrabold text-stone-900 dark:text-white">
            {isFarmer ? 'Farm Orders & Dispatch Desk' : 'My Farm Direct Orders'}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            {isFarmer
              ? 'Manage inbound harvest orders, print batch labels, and track direct escrow payouts'
              : 'Track real-time harvest dispatch, verify crop batch numbers, and release escrow upon delivery'}
          </p>
        </div>

        <button
          onClick={() => onNavigate('/marketplace')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
        >
          Explore More Produce
        </button>
      </div>

      {/* Two-Column Orders Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Orders List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Active Orders ({displayOrders.length})
            </span>
          </div>

          {displayOrders.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-2">
              <PackageCheck className="w-8 h-8 text-stone-400 mx-auto" />
              <p className="font-bold text-stone-800 dark:text-stone-200 text-xs">No orders placed yet</p>
              <button
                onClick={() => onNavigate('/marketplace')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Browse Fresh Farm Produce
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {displayOrders.map((ord) => {
                const isSelected = selectedOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedOrder(ord)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-xs space-y-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-md ring-1 ring-emerald-500/30'
                        : 'border-stone-200/90 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-stone-900 dark:text-white">
                        {ord.order_code}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.order_status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                            : ord.order_status === 'Dispatched'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        }`}
                      >
                        {ord.order_status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-[10px] font-semibold text-stone-600 dark:text-stone-300">
                        Buyer: {ord.buyer_type}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {ord.items.length} crop item{ord.items.length === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60 dark:border-stone-800/60">
                      <span className="text-stone-400 text-[11px]">
                        {new Date(ord.created_at).toLocaleDateString()}
                      </span>
                      <span className="font-extrabold text-stone-900 dark:text-white text-xs">
                        {formatCurrency(ord.total_amount)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Order Detail & Timeline Tracking (7 cols) */}
        <div className="lg:col-span-7">
          {selectedOrder ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-6 text-xs">
              
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-stone-900 dark:text-white font-mono">
                      {selectedOrder.order_code}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      {selectedOrder.buyer_type} Order
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Placed on {new Date(selectedOrder.created_at).toLocaleString()}
                  </p>
                </div>

                {/* Escrow Status Tag */}
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    Escrow Protection
                  </span>
                  <span className={`inline-flex items-center gap-1 font-bold text-xs ${
                    selectedOrder.payment_status === 'Released to Farmer'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    <ShieldCheck className="w-4 h-4" />
                    {selectedOrder.payment_status}
                  </span>
                </div>
              </div>

              {/* Real-Time Supply Chain Tracking Timeline */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-stone-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Farm-to-Fork Tracking Pipeline</span>
                </h4>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800">
                  {selectedOrder.tracking_steps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-stone-900 ${
                          step.completed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-300 dark:bg-stone-700 text-stone-500'
                        }`}
                      >
                        {step.completed ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-xs ${
                            step.completed ? 'text-stone-900 dark:text-white' : 'text-stone-400'
                          }`}>
                            {step.step}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            {step.timestamp}
                          </span>
                        </div>
                        {step.note && (
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                            {step.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                <h4 className="font-extrabold text-stone-900 dark:text-white text-xs uppercase tracking-wider">
                  Ordered Produce Items
                </h4>

                <div className="space-y-2">
                  {selectedOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <h5 className="font-extrabold text-stone-900 dark:text-white text-xs">
                            {item.product_name}
                          </h5>
                          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            {item.farm_name}
                          </p>
                          <span className="text-[10px] text-stone-400">
                            Qty: {item.quantity} {item.unit} @ {formatCurrency(item.price_per_unit)}
                          </span>
                        </div>
                      </div>

                      <span className="font-extrabold text-stone-900 dark:text-white text-xs">
                        {formatCurrency(item.total_price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown & Transparent Savings */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span>Farm Cold Delivery:</span>
                  <span className="font-semibold">
                    {selectedOrder.delivery_fee === 0 ? 'FREE' : formatCurrency(selectedOrder.delivery_fee)}
                  </span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-300 font-semibold">
                  <span>Direct Customer Savings vs Retail:</span>
                  <span>+{formatCurrency(selectedOrder.direct_farmer_savings)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-stone-900 dark:text-white pt-2 border-t border-emerald-200 dark:border-emerald-800">
                  <span>Total Amount Paid:</span>
                  <span>{formatCurrency(selectedOrder.total_amount)}</span>
                </div>
              </div>

              {/* Delivery Address & Verification QR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    Delivery Destination
                  </span>
                  <p className="font-bold text-stone-900 dark:text-white text-xs">
                    {selectedOrder.customer_name}
                  </p>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {selectedOrder.delivery_address.street}, {selectedOrder.delivery_address.district}, {selectedOrder.delivery_address.state} - {selectedOrder.delivery_address.pincode}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1">
                      <QrCode className="w-3 h-3 text-emerald-600" />
                      Handover OTP / QR
                    </span>
                    <p className="font-mono font-bold text-xs text-stone-900 dark:text-white">
                      OTP: 8492
                    </p>
                    <p className="text-[10px] text-stone-400">Show to courier driver</p>
                  </div>
                  <div className="w-12 h-12 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-xl flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-stone-800 dark:text-stone-200" />
                  </div>
                </div>
              </div>

              {/* Action Buttons based on Role & Status */}
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
                {isFarmer ? (
                  /* Farmer Stage Actions */
                  <div className="flex items-center gap-2 w-full justify-end">
                    {selectedOrder.order_status !== 'Delivered' && (
                      <button
                        onClick={() => handleFarmerAdvanceStatus(selectedOrder.id, selectedOrder.order_status)}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-2"
                      >
                        <span>
                          {selectedOrder.order_status === 'Confirmed' || selectedOrder.order_status === 'Pending'
                            ? 'Mark Lots Packed in Cold Storage'
                            : selectedOrder.order_status === 'Packed'
                            ? 'Dispatch in Refrigerated Van'
                            : 'Confirm Customer Handover'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ) : (
                  /* Customer Actions: Confirm Delivery & Release Escrow / Review / Dispute */
                  <div className="flex flex-wrap items-center justify-between w-full gap-2">
                    <button
                      onClick={() => setDisputeModalOrder(selectedOrder)}
                      className="text-stone-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Report Issue / Quality Check</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {selectedOrder.order_status !== 'Delivered' ? (
                        <button
                          onClick={() => handleConfirmDelivery(selectedOrder.id)}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm Received & Release Escrow</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setReviewModalOrder(selectedOrder)}
                          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-md transition-colors flex items-center gap-1.5"
                        >
                          <Star className="w-4 h-4 fill-white" />
                          <span>Rate & Review Harvest</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <p className="text-xs text-stone-500">Select an order on the left to inspect its supply chain timeline</p>
            </div>
          )}
        </div>

      </div>

      {/* REVIEW PRODUCE MODAL */}
      {reviewModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 dark:text-white text-base">
                Review Produce Quality
              </h3>
              <button
                onClick={() => setReviewModalOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {reviewSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                  Review Published to Farmer's Profile!
                </h4>
                <p className="text-xs text-stone-500">
                  Thank you for empowering verified local growers with transparent feedback.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Rating (1 to 5 Stars):
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="p-1 text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${s <= reviewRating ? 'fill-amber-400' : 'text-stone-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Quality, Freshness & Flavor Feedback:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalOrder(null)}
                    className="px-3 py-1.5 rounded-xl border text-stone-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                  >
                    Publish Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DISPUTE MODAL */}
      {disputeModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-stone-900 dark:text-white text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Open Escrow Mediation</span>
              </h3>
              <button
                onClick={() => setDisputeModalOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {disputeSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="font-extrabold text-stone-900 dark:text-white text-sm">
                  Dispute Case Registered
                </h4>
                <p className="text-xs text-stone-500">
                  Escrow payment is frozen until Agriculture Officer verifies the case.
                </p>
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit} className="space-y-4 text-xs">
                <p className="text-stone-600 dark:text-stone-300 text-xs">
                  Your funds are protected. If the produce was damaged, spoiled, or failed quality specifications, our admin officers mediate a partial or full escrow refund.
                </p>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Describe the Quality Issue:
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setDisputeModalOrder(null)}
                    className="px-3 py-1.5 rounded-xl border text-stone-600 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
                  >
                    Freeze Escrow & Open Case
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
