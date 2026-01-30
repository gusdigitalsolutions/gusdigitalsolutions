import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'gds-cookie-consent';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShowBanner(false);
    // GA is already loaded, no additional action needed
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setShowBanner(false);
    // Disable GA tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] p-4 md:p-6 animate-slide-up"
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-description"
    >
      <div className="max-w-4xl mx-auto bg-dark-800/95 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
          <div className="flex-1">
            <h3 id="cookie-title" className="text-white font-semibold text-lg mb-2">
              Cookie Notice
            </h3>
            <p id="cookie-description" className="text-dark-300 text-sm leading-relaxed">
              We use cookies to analyze site traffic and improve your experience.
              By clicking "Accept", you consent to our use of cookies as described in our{' '}
              <a href="/privacy-policy" className="text-primary-400 hover:text-primary-300 underline">
                Privacy Policy
              </a>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={handleDecline}
              className="px-5 py-2.5 text-sm font-medium text-dark-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all duration-200"
              aria-label="Decline cookies"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-500 rounded-lg transition-all duration-200 shadow-lg shadow-primary-600/25"
              aria-label="Accept cookies"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
