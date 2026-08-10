import { createContext, useContext, useMemo, useState } from 'react';
import { shubhKartProducts, freeGift } from '../data/appData';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [address, setAddress] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [rashi, setRashi] = useState(null);
  const [intent, setIntent] = useState('all');
  const [favorites, setFavorites] = useState(() => new Set());
  const [deliveryDay, setDeliveryDay] = useState('any');

  const add = (product) => {
    setItems((prev) => {
      const found = prev.find((it) => it.productId === product.id);
      if (found) return prev.map((it) => it.productId === product.id ? { ...it, qty: it.qty + 1 } : it);
      return [...prev, { productId: product.id, qty: 1 }];
    });
  };

  const setQty = (productId, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((it) => it.productId !== productId));
      return;
    }
    setItems((prev) => prev.map((it) => it.productId === productId ? { ...it, qty } : it));
  };

  const remove = (productId) => setItems((prev) => prev.filter((it) => it.productId !== productId));
  const clear = () => setItems([]);

  const toggleFav = (productId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId); else next.add(productId);
      return next;
    });
  };

  const placeOrder = () => {
    const id = 'SK-' + Date.now().toString(36).toUpperCase();
    setLastOrderId(id);
    setItems([]);
    return id;
  };

  const value = useMemo(() => {
    const enriched = items
      .map((it) => {
        const product = shubhKartProducts.find((p) => p.id === it.productId);
        return product ? { ...it, product, lineTotal: product.price * it.qty } : null;
      })
      .filter(Boolean);
    const subtotal = enriched.reduce((sum, it) => sum + it.lineTotal, 0);
    const count = enriched.reduce((sum, it) => sum + it.qty, 0);
    const giftUnlocked = subtotal >= freeGift.threshold;
    const giftRemaining = Math.max(0, freeGift.threshold - subtotal);
    return {
      items: enriched,
      count,
      subtotal,
      add,
      remove,
      setQty,
      clear,
      address,
      setAddress,
      lastOrderId,
      placeOrder,
      rashi,
      setRashi,
      intent,
      setIntent,
      favorites,
      toggleFav,
      isFav: (id) => favorites.has(id),
      deliveryDay,
      setDeliveryDay,
      giftUnlocked,
      giftRemaining
    };
  }, [items, address, lastOrderId, rashi, intent, favorites, deliveryDay]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
