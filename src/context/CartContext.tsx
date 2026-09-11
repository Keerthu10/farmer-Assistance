import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MarketplaceProduct, MarketplaceOrder, BuyerType } from '../types';
import { INITIAL_ORDERS } from '../data/marketplaceData';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: MarketplaceProduct, quantity?: number, selectedUnit?: string) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalCount: number;
  subtotalAmount: number;
  farmerDirectSavings: number;
  totalSavings: number;
  farmerGainOverMandi: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  orders: MarketplaceOrder[];
  createOrder: (orderPayload: {
    buyerType: BuyerType;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: {
      street: string;
      district: string;
      state: string;
      pincode: string;
    };
    paymentMethod: 'UPI' | 'Direct Card' | 'Escrow Bank Transfer' | 'Cash on Delivery';
  }) => Promise<MarketplaceOrder>;
  updateOrderStatus: (orderId: number, newStatus: MarketplaceOrder['order_status']) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('agroassist_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    try {
      const saved = localStorage.getItem('agroassist_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('agroassist_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('agroassist_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: MarketplaceProduct, quantity = 1, selectedUnit?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      const minQty = Math.max(quantity, product.min_order_qty || 1);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity: minQty, selectedUnit: selectedUnit || product.unit }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotalAmount = items.reduce(
    (sum, item) => sum + item.product.price_per_unit * item.quantity,
    0
  );

  // Transparent calculation of savings vs retail supermarket
  const farmerDirectSavings = items.reduce((sum, item) => {
    const diff = Math.max(0, item.product.retail_supermarket_price - item.product.price_per_unit);
    return sum + diff * item.quantity;
  }, 0);

  // Transparent calculation of farmer gain vs middleman mandi rate
  const farmerGainOverMandi = items.reduce((sum, item) => {
    const diff = Math.max(0, item.product.price_per_unit - item.product.mandi_benchmark_price);
    return sum + diff * item.quantity;
  }, 0);

  const createOrder = async (payload: {
    buyerType: BuyerType;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryAddress: {
      street: string;
      district: string;
      state: string;
      pincode: string;
    };
    paymentMethod: 'UPI' | 'Direct Card' | 'Escrow Bank Transfer' | 'Cash on Delivery';
  }): Promise<MarketplaceOrder> => {
    const deliveryFee = subtotalAmount > 1500 ? 0 : 80;
    const totalAmount = subtotalAmount + deliveryFee;
    const farmerIds: number[] = Array.from(new Set<number>(items.map((i) => i.product.farmer_id)));

    const orderCode = `F2C-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const estDelivery = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

    const newOrder: MarketplaceOrder = {
      id: Date.now(),
      order_code: orderCode,
      customer_id: 10,
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      customer_phone: payload.customerPhone,
      buyer_type: payload.buyerType,
      delivery_address: payload.deliveryAddress,
      items: items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        farmer_id: item.product.farmer_id,
        farm_name: item.product.farm_name,
        quantity: item.quantity,
        unit: item.selectedUnit,
        price_per_unit: item.product.price_per_unit,
        total_price: item.product.price_per_unit * item.quantity,
        image_url: item.product.image_url,
      })),
      farmer_ids: farmerIds,
      subtotal: subtotalAmount,
      delivery_fee: deliveryFee,
      direct_farmer_savings: farmerDirectSavings,
      total_amount: totalAmount,
      order_status: 'Confirmed',
      payment_status: 'Escrow Held',
      payment_method: payload.paymentMethod,
      harvest_date: items[0]?.product.harvest_date || now.toISOString(),
      estimated_delivery: estDelivery,
      tracking_steps: [
        {
          step: 'Order Confirmed & Escrow Secured',
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
          completed: true,
          note: 'Funds held in trust; released only after you verify delivery.',
        },
        {
          step: 'Farm Harvest & Quality Verification',
          timestamp: 'Scheduled in 2 hours',
          completed: false,
          note: 'Direct farm inspection by grower',
        },
        {
          step: 'Packed in Breathable Crates',
          timestamp: 'Pending harvest',
          completed: false,
        },
        {
          step: 'Dispatched via Direct Cold Van',
          timestamp: 'Pending packing',
          completed: false,
        },
        {
          step: 'Delivered & Escrow Released to Farmer',
          timestamp: 'Tomorrow morning',
          completed: false,
        },
      ],
      has_reviewed: false,
      dispute_status: 'None',
      created_at: now.toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);
    return newOrder;
  };

  const updateOrderStatus = (orderId: number, newStatus: MarketplaceOrder['order_status']) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const updatedSteps = [...ord.tracking_steps];
        let paymentStatus = ord.payment_status;
        if (newStatus === 'Delivered') {
          paymentStatus = 'Released to Farmer';
          updatedSteps.forEach((s) => (s.completed = true));
        } else if (newStatus === 'Dispatched') {
          if (updatedSteps[1]) updatedSteps[1].completed = true;
          if (updatedSteps[2]) updatedSteps[2].completed = true;
          if (updatedSteps[3]) updatedSteps[3].completed = true;
        } else if (newStatus === 'Packed') {
          if (updatedSteps[1]) updatedSteps[1].completed = true;
          if (updatedSteps[2]) updatedSteps[2].completed = true;
        }
        return {
          ...ord,
          order_status: newStatus,
          payment_status: paymentStatus,
          tracking_steps: updatedSteps,
          delivered_at: newStatus === 'Delivered' ? new Date().toISOString() : ord.delivered_at,
        };
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalCount: totalItems,
        subtotalAmount,
        farmerDirectSavings,
        totalSavings: farmerDirectSavings,
        farmerGainOverMandi,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        orders,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
