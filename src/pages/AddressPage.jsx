import { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { AppHeader } from '../components/layout/AppHeader';
import { BottomNav } from '../components/layout/BottomNav';
import { useCart } from '../state/CartContext';

const fields = [
  { name: 'name', label: 'Full name', placeholder: 'e.g. Naveen Karri', type: 'text' },
  { name: 'phone', label: 'Phone number', placeholder: '10-digit mobile', type: 'tel', maxLength: 10 },
  { name: 'pincode', label: 'Pincode', placeholder: '6-digit pincode', type: 'tel', maxLength: 6 },
  { name: 'city', label: 'City', placeholder: 'e.g. Hyderabad', type: 'text' },
  { name: 'addressLine', label: 'Address', placeholder: 'House / street / landmark', type: 'text', textarea: true }
];

const deliveryDays = [
  { id: 'any', label: 'Any day', hint: 'Fastest' },
  { id: 'monday', label: 'Monday', hint: 'Chandra' },
  { id: 'thursday', label: 'Thursday', hint: 'Guru' },
  { id: 'friday', label: 'Friday', hint: 'Shukra' },
  { id: 'saturday', label: 'Saturday', hint: 'Shani' }
];

export function AddressPage({ onNavigate }) {
  const { address, setAddress, count, deliveryDay, setDeliveryDay } = useCart();
  const [form, setForm] = useState(address || { name: '', phone: '', pincode: '', city: '', addressLine: '' });

  const isValid = form.name.trim() && /^\d{10}$/.test(form.phone) && /^\d{6}$/.test(form.pincode) && form.city.trim() && form.addressLine.trim();

  const submit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setAddress(form);
    onNavigate('confirm');
  };

  const backTarget = count === 0 ? 'shubh-kart' : 'cart';

  return (
    <div className="app-screen">
      <AppHeader variant="back" title="Delivery Address" onBack={() => onNavigate(backTarget)} />
      <main className="address-main">
        <form className="address-form" onSubmit={submit}>
          {fields.map((f) => (
            <label key={f.name} className="field">
              <span>{f.label}</span>
              {f.textarea ? (
                <textarea
                  rows={3}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                />
              ) : (
                <input
                  type={f.type}
                  maxLength={f.maxLength}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                />
              )}
            </label>
          ))}

          <div className="day-picker">
            <div className="day-picker-head">
              <CalendarClock size={16} />
              <b>Auspicious delivery day</b>
              <span className="tip">Pick a day ruled by a favourable planet</span>
            </div>
            <div className="day-chips">
              {deliveryDays.map((d) => (
                <button
                  type="button"
                  key={d.id}
                  className={`day-chip ${deliveryDay === d.id ? 'active' : ''}`}
                  onClick={() => setDeliveryDay(d.id)}
                >
                  <b>{d.label}</b>
                  <span>{d.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="primary-btn full" disabled={!isValid}>Continue to Payment</button>
        </form>
      </main>
      <BottomNav active="shubh-kart" onNavigate={onNavigate} />
    </div>
  );
}
