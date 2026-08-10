import { ShoppingBag } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { CartLineItem } from '../components/shop/CartLineItem';
import { FreeGiftBar } from '../components/shop/FreeGiftBar';
import { useCart } from '../state/CartContext';
import { freeGift } from '../data/appData';

export function CartPage({ onNavigate }) {
  const { items, subtotal, count, giftUnlocked } = useCart();

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Your Cart" onBack={() => onNavigate('shubh-kart')} />
      <main className="cart-main">
        {count === 0 ? (
          <div className="cart-empty">
            <ShoppingBag size={48} />
            <h3>Your cart is empty</h3>
            <p>Add sacred items or poojas to get started.</p>
            <button className="primary-btn" onClick={() => onNavigate('shubh-kart')}>Shop now</button>
          </div>
        ) : (
          <>
            <FreeGiftBar />

            <div className="cart-list">
              {items.map((line) => <CartLineItem key={line.productId} line={line} />)}
              {giftUnlocked && (
                <div className="cart-line free">
                  <img src={freeGift.image} alt={freeGift.name} />
                  <div className="cart-line-body">
                    <b>{freeGift.name} {freeGift.emoji}</b>
                    <span>Bonus gift · unlocked</span>
                    <div className="cart-line-controls">
                      <span className="free-tag">FREE</span>
                      <strong>₹0</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="cart-total">
              <div className="row"><span>Subtotal</span><strong>₹{subtotal}</strong></div>
              <div className="row"><span>Delivery</span><strong>FREE</strong></div>
              {giftUnlocked && <div className="row"><span>Bonus gift</span><strong className="pos">− ₹0</strong></div>}
              <div className="row grand"><span>Total</span><strong>₹{subtotal}</strong></div>
            </div>
            <button className="primary-btn full" onClick={() => onNavigate('address')}>Proceed to Address</button>
          </>
        )}
      </main>
      <BottomNav active="shubh-kart" onNavigate={onNavigate} />
    </div>
  );
}
