// src/components/CheckoutButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Shield, Zap, AlertCircle } from 'lucide-react';

export function CheckoutButton() {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const variantId = process.env.NEXT_PUBLIC_LEMONSQUEZY_PRO_VARIANT_ID;

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50;

    const checkSDK = () => {
      attempts++;

      if (typeof window !== 'undefined' && (window as any).LemonSqueezy) {
        // console.log('✅ LemonSqueezy SDK loaded successfully');
        setIsSDKReady(true);
        setIsLoading(false);
        setError(null);
        return true;
      }

      if (typeof window !== 'undefined' && typeof (window as any).createLemonSqueezy === 'function') {
        try {
          (window as any).createLemonSqueezy();
          if ((window as any).LemonSqueezy) {
            console.log('✅ LemonSqueezy SDK initialized');
            setIsSDKReady(true);
            setIsLoading(false);
            setError(null);
            return true;
          }
        } catch (err) {
          console.warn('Failed to initialize LemonSqueezy:', err);
        }
      }

      if (attempts >= maxAttempts) {
        console.error('❌ LemonSqueezy SDK failed to load');
        setError('Please disable ad blockers or privacy extensions');
        setIsLoading(false);
        return true;
      }

      return false;
    };

    if (checkSDK()) return;

    const interval = setInterval(() => {
      if (checkSDK()) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const openCheckout = () => {
    if (!variantId) {
      alert('Configuration error: Missing variant ID');
      return;
    }

    if (!isSDKReady) {
      window.open(
        `https://checkout.lemonsqueezy.com/buy/${variantId}`,
        '_blank',
        'noopener,noreferrer'
      );
      return;
    }

    try {
      const LemonSqueezy = (window as any).LemonSqueezy;
      
      LemonSqueezy.Setup({
        eventHandler: (event: any) => {
          console.log('LemonSqueezy Event:', event);
          
          if (event.event === 'Checkout.Success') {
            console.log('🎉 Purchase successful!');
            window.location.href = '/dashboard?upgrade=success';
          }
        }
      });

      LemonSqueezy.Url.Open(`https://checkout.lemonsqueezy.com/buy/${variantId}`);
      
      console.log('✅ Checkout overlay opened');
    } catch (err) {
      console.error('❌ Failed to open checkout:', err);
      
      alert('Opening checkout in new tab');
      window.open(
        `https://checkout.lemonsqueezy.com/buy/${variantId}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <div className="w-full space-y-4">
      <button
        onClick={openCheckout}
        disabled={isLoading && !error}
        className={`w-full group relative overflow-hidden rounded-xl font-bold transition-all duration-300 ${
          isLoading && !error
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : error
            ? 'bg-orange-500 text-white hover:bg-orange-600'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transform hover:scale-105 shadow-lg hover:shadow-xl'
        }`}
      >
        {!isLoading && !error && (
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        )}
        
        <div className="relative py-4 px-6 flex items-center justify-center gap-2">
          {isLoading && !error ? (
            <>
              <div className="w-5 h-5 border-3 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              Loading Checkout...
            </>
          ) : error ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Open Checkout Anyway
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Upgrade to Pro Now</span>
            </>
          )}
        </div>
      </button>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="text-orange-800">
            <p className="font-medium mb-1">Ad blocker detected</p>
            <p className="text-xs text-orange-600">
              Click the button to open checkout in a new tab.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <Shield className="w-4 h-4 text-green-600" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-4 h-4 text-blue-600" />
          <span>Instant Access</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <p className="text-sm text-gray-700 font-medium mb-2">✨ Included in Pro:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Unlimited projects & forms</li>
          <li>• 90-day analytics history</li>
          <li>• 50,000 interactions/month</li>
          <li>• Advanced insights & exports</li>
          <li>• Priority support</li>
        </ul>
      </div>
    </div>
  );
}