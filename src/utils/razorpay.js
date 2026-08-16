import { RAZORPAY_KEY_ID, RAZORPAY_BRAND } from '../config/razorpay';

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let scriptPromise = null;

function loadScript() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = CHECKOUT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { scriptPromise = null; reject(new Error('Failed to load Razorpay checkout script')); };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function isConfigured() {
  return typeof RAZORPAY_KEY_ID === 'string' && RAZORPAY_KEY_ID.startsWith('rzp_') && !RAZORPAY_KEY_ID.includes('XXXX');
}

// Opens the Razorpay checkout modal. Resolves with { paymentId } on success,
// rejects with { code: 'dismissed'|'error', message } on failure or user close.
export function openCheckout({ amount, orderId, prefill = {}, notes = {} }) {
  return new Promise(async (resolve, reject) => {
    try {
      await loadScript();
    } catch (e) {
      reject({ code: 'error', message: e.message });
      return;
    }

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // paise
      currency: RAZORPAY_BRAND.currency,
      name: RAZORPAY_BRAND.name,
      description: RAZORPAY_BRAND.description,
      image: 'https://cdn-icons-png.flaticon.com/512/6132/6132220.png',
      handler: (response) => {
        resolve({ paymentId: response.razorpay_payment_id });
      },
      prefill: {
        name: prefill.name || '',
        contact: prefill.phone || '',
        email: prefill.email || ''
      },
      notes: { internalOrderId: orderId, ...notes },
      theme: { color: RAZORPAY_BRAND.themeColor },
      modal: {
        ondismiss: () => reject({ code: 'dismissed', message: 'Payment cancelled' })
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (resp) => {
      reject({ code: 'error', message: resp?.error?.description || 'Payment failed', raw: resp });
    });
    rzp.open();
  });
}
