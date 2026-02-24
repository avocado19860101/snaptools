'use client';
import { useState, useEffect } from 'react';

export default function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setShow(true);
  }, []);
  const accept = () => { localStorage.setItem('cookie-consent', 'accepted'); setShow(false); };
  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-xl mx-auto">
      <div className="glass-strong rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            We use cookies to improve your experience. By continuing, you agree to our{' '}
            <a href="/privacy-policy" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a>.
          </p>
          <button
            onClick={accept}
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors shadow-md"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
