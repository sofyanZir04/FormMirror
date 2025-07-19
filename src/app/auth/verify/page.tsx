'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';

function VerifyContent() {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleVerify = async () => {
    if (!token) {
      toast.error('No verification token found');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });

      if (error) throw error;

      setVerified(true);
      toast.success('Email verified successfully!');
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'message' in error) {
        toast.error((error as { message: string }).message);
      } else {
        toast.error('Verification failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Toaster position="top-right" />
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Email Verified!</h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email has been successfully verified. You can now access all features of FormMirror.
            </p>
          </div>
          <div>
            <Link
              href="/dashboard"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            Click the button below to verify your email address and complete your registration.
          </p>
        </div>
        <div>
          <button
            onClick={handleVerify}
            disabled={loading || !token}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>
        <div className="text-center">
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Loading...</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we load the verification page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyContent />
    </Suspense>
  );
} 