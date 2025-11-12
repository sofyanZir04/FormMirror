// src/components/CheckoutButton.tsx
'use client';


import { useState, useEffect } from 'react'
import { AlertCircle, ExternalLink } from 'lucide-react'

export function CheckoutButton() {
    const [isSDKReady, setIsSDKReady] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        let mounted = true;
        let checkInterval: NodeJS.Timeout;
        let timeoutId: NodeJS.Timeout;

        const checkSDK = () => {
        try {
            // Check if LemonSqueezy global exists
            if (typeof (window as any).LemonSqueezy !== 'undefined') {
            if (mounted) {
                setIsSDKReady(true);
                setIsChecking(false);
                setLoadError(false);
            }
            return true;
            }

            // Try to initialize if createLemonSqueezy exists
            if (typeof (window as any).createLemonSqueezy === 'function') {
            (window as any).createLemonSqueezy();
            if (typeof (window as any).LemonSqueezy !== 'undefined') {
                if (mounted) {
                setIsSDKReady(true);
                setIsChecking(false);
                setLoadError(false);
                }
                return true;
            }
            }
        } catch (err) {
            console.warn('LemonSqueezy SDK check failed:', err);
        }
        return false;
        };

        // Initial check
        if (checkSDK()) {
        return;
        }

        // Check every 200ms for up to 5 seconds
        checkInterval = setInterval(() => {
        if (checkSDK()) {
            clearInterval(checkInterval);
        }
        }, 200);

        // Timeout after 5 seconds - but DON'T show error, use fallback
        timeoutId = setTimeout(() => {
        if (mounted && !isSDKReady) {
            console.log('LemonSqueezy SDK not loaded, will use direct link fallback');
            clearInterval(checkInterval);
            setIsChecking(false);
            // Don't set loadError - just use fallback
        }
        }, 5000);

        return () => {
        mounted = false;
        clearInterval(checkInterval);
        clearTimeout(timeoutId);
        };
    }, []);

    const variantId = process.env.NEXT_PUBLIC_LEMONSQUEZY_PRO_VARIANT_ID;

    const handleCheckout = () => {
        // ALWAYS provide a way to checkout
        const checkoutUrl = `https://checkout.lemonsqueezy.com/buy/${variantId}`;

        // Try embedded checkout first if SDK is ready
        if (isSDKReady && !loadError) {
        try {
            const ls = (window as any).LemonSqueezy;
            if (ls && ls.Url && ls.Url.Open) {
            ls.Url.Open(`${checkoutUrl}?embed=1&media=0`);
            
            // Setup event handler if available
            if (ls.Setup) {
                ls.Setup({
                eventHandler: (e: any) => {
                    if (e.eventName === 'Checkout.Success') {
                    // console.log('Checkout Success!');
                    // Redirect to success page or refresh
                    window.location.href = '/dashboard?upgrade=success';
                    }
                },
                });
            }
            return;
            }
        } catch (err) {
            console.warn('Embedded checkout failed, using fallback:', err);
        }
        }

        // Fallback: Open in new tab (ALWAYS works)
        window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    };

    // Don't show error state to users - always allow checkout
    return (
        <div className="w-full space-y-2">
        <button
            onClick={handleCheckout}
            disabled={isChecking || !variantId}
            className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
            isChecking
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-violet-600 hover:bg-gray-100 hover:scale-105 transform'
            }`}
        >
            {isChecking ? (
            <>
                <div className="w-4 h-4 border-2 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
                Loading Checkout...
            </>
            ) : (
            <>
                Start Converting More Users
                {!isSDKReady && <ExternalLink className="w-4 h-4" />}
            </>
            )}
        </button>

        {/* Info message if SDK didn't load (not an error!) */}
        {!isChecking && !isSDKReady && (
            <div className="flex items-start gap-2 text-xs text-gray-500 bg-blue-50 p-2 rounded">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-500" />
            <p>
                Checkout will open in a new tab. If you have ad blockers enabled, you may need to allow popups.
            </p>
            </div>
        )}

        {/* Fallback link (always available) */}
        {!isChecking && variantId && (
            <a
            href={`https://checkout.lemonsqueezy.com/buy/${variantId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-xs text-gray-300 hover:text-gray-700 underline"
            >
            Or click here to checkout directly
            </a>
        )}
        </div>
    );
}
  
  