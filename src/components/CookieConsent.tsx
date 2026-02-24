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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm">We use cookies to improve your experience and for analytics. By continuing to use this site, you agree to our <a href="/privacy-policy" className="underline text-blue-300">Privacy Policy</a>.</p>
        <button onClick={accept} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium whitespace-nowrap">Accept Cookies</button>
      </div>
    </div>
  );
}
